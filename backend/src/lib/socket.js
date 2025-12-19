import { Server } from "socket.io";
import http from "http";
import express from "express";
import {ENV} from "./env.js";
import { socketAuthMiddleWare } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true
    }
});

// apply auth middleware to all socket connections
io.use(socketAuthMiddleWare);

export function getReceiverSocketId(userId){
    return userSocketmap[userId];
};

// this is for storing online users
const userSocketmap = {}; // {userId : socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    userSocketmap[userId] = socket.id;

    // io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    // with socket.on we listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketmap));
    });
});

export { io, app, server };