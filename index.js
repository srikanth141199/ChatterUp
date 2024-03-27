
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from "http";


import { connect } from './config.js';
import { chatModel } from './chart.schema.js';
import { userListModel } from './userList.schema.js';


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
    socket.userList = [];

    socket.on("join", (data) => {
        socket.username = data;

        let user = {
            username: socket.username
        }

        const newUser = new userListModel({
            username : socket.username
        })

        newUser.save();

        userListModel.find().limit(50).then(users => {
            socket.emit('connectedUsers', users);
        }).catch(err => {
            console.log(err);
        })

        socket.broadcast.emit("loggedInUser", user);

        // send old messages to the clients.
        chatModel.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })

        socket.emit('welcome', socket.username);
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

    socket.on('disconnect', () => {
        console.log("disconnect user name : ", socket.username);
        setTimeout(() => {
            userListModel.deleteOne({username: socket.username}).then(() => {
                console.log("User deleted:", socket.username);
            }).catch(err => {
                console.error("Error deleting user:", err);
            });

            userListModel.find().limit(50).then(users => {
                socket.emit('connectedUsers', users);
            }).catch(err => {
                console.log(err);
            })

        }, 1000); // Delay deletion by 1 second
        console.log("Connection is disconnected");
    })
    

})

server.listen(3200, () => {
    console.log("Server is listening on 3200");
    connect();
})