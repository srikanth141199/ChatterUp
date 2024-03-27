
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from "http";


import { connect } from './config.js';
import { chatModel } from './chart.schema.js';


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});


io.on("connection", function (socket) {
    console.log("connection is Established");

    socket.on("join", (data) => {
        socket.username = data;
        // send old messages to the clients.
        chatModel.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })
    });

    socket.on('new_message', (data) => {
        let userMessage = {
            username : socket.username,
            message : data
        }

        const newMessage = new chatModel({
            username : socket.username,
            message : data,
            timestamp : new Date()
        })

        newMessage.save();

        socket.broadcast.emit('broadcast_message', userMessage);
    })

})

server.listen(3200, () => {
    console.log("Server is listening on 3200");
    connect();
})