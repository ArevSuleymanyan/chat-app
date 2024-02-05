const RedisBaseService = require('./RedisBaseService');

const ROOM = 'chat'

class RedisMessageService extends RedisBaseService{
    constructor(client){
        super(client);
    }
    async getMessages(){
        return  this.getRedisData(ROOM)
    }
    async addNewMessage(message){
        return  this.push(message, ROOM)
    }

}

module.exports = RedisMessageService
