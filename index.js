
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import http from "http";


import { connect } from './config.js';


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});


io.on("connection", function () {
    console.log("connection is Established");
})

server.listen(3200, () => {
    console.log("Server is listening on 3200");
    connect();
})