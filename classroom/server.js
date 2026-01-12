const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});

io.on('connection', (socket) => {
    console.log('A student joined:', socket.id);

   
    socket.on('send_note', (data) => {
       
        socket.broadcast.emit('receive_note', data);
    });

    socket.on('disconnect', () => {
        console.log('A student left');
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
});