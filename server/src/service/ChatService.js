const { Server } = require('socket.io')
const cluster = require('cluster')
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const RedisUserService = require('../service/RedisUserService')
const RedisMessageService = require('../service/RedisMessageService')
const {CONNECTION, JOIN_SERVER, JOIN_ROOM, NEW_MESSAGE, DISCONNECT, CURRENT_USER, ALL_USERS, NEW_USER, JOINED, MESSAGES} = require("../types/socket-event-types");


class ChatService{
    constructor(server, host, client) {
        this.server = server;
        this.host = host;
        this.redisUserService = new RedisUserService(client)
        this.redisMessageService = new RedisMessageService(client)
    }

    connect(){
        if(cluster.isMaster){
            this.createSocketIOMaster();
        }else{
            this.createSocketIOSlave();
        }
    }

    createSocketIOMaster() {
        setupMaster(this.server, {
            loadBalancingMethod: "least-connection",
        });

        setupPrimary();
        cluster.setupPrimary({
            serialization: "advanced",
        });
        this.server.listen(8080, () => {
            console.log(`Listening on:${8080}`)
        });
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker) => {
            cluster.fork();
        });
    }


    createSocketIOSlave() {
        this.socketIO = new Server(this.server, {
            cors: {
                origin: this.host,
                methods: ['GET', 'POST'],
                credentials: true,
            },
        })
        this.socketIO.adapter(createAdapter())
        setupWorker(this.socketIO);

        this.socketIO.on(CONNECTION, (socket) =>  this.onSocketConnected(socket));
    }

    onSocketConnected = (socket) => {
        console.log("onSocketConnected")
        socket.addListener = (name, callback) => {
            socket.on(name, (...args) => callback(socket, ...args))
        }
        socket.addListener(JOIN_SERVER, this.joinToServer)
        socket.addListener(NEW_MESSAGE, this.sendMessage)
        socket.addListener(DISCONNECT, this.disconnect)
    }

    removeSocketListeners = (socket) => {
        socket.off(JOIN_SERVER)
        socket.off(JOIN_ROOM)
        socket.off(NEW_MESSAGE)
        socket.off(DISCONNECT)
    }

    joinToServer = async (socket, userName, room) =>{
        const user = {userName, id: socket.id}
        await this.redisUserService.addNewUser(user)
        let users = await this.redisUserService.getAllUsers()
        const messages = await this.redisMessageService.getMessages()

        socket.emit(CURRENT_USER, user)
        socket.join(room)
        socket.broadcast.emit(NEW_USER, userName);
        this.socketIO.to(room).emit(ALL_USERS, users)
        this.socketIO.to(room).emit(MESSAGES, messages);
    }



    sendMessage = async (socket,{content, sender, room, id}) =>{
        const message = {content, sender, id}
        this.socketIO.in(room).emit(NEW_MESSAGE,message );
        await this.redisMessageService.addNewMessage( message)

        const messages = await this.redisMessageService.getMessages()
        this.socketIO.in(room).emit(MESSAGES, messages)
    }

    disconnect = async (socket, ) => {
        console.log("disconnect", socket.id)
        await this.redisUserService.removeUser(socket.id)
        let users = await this.redisUserService.getAllUsers()
        socket.disconnect()
        this.socketIO.emit(ALL_USERS, users)
    }

}

module.exports = ChatService
