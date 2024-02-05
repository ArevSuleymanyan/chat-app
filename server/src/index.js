const express = require('express');
const app = express()
const http = require('http')
const server = http.createServer(app)
const {createClient} = require('redis')
const ChatService = require('./service/ChatService')


const HOST = 'http://localhost:3050'

const client = createClient({
    url: 'redis://redis-server:6379'
});

client.on('error', (err) =>{
    console.log('Error message:', err.message)
})
const connectClient = async () => {
    await client.connect()
}
connectClient()

const chatService = new ChatService(server, HOST, client)
chatService.connect()




