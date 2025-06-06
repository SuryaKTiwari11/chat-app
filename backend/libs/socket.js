import { Server } from "socket.io";
import http from "http";
import express from "express";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.PRODUCTION_URL,
      process.env.LOCAL_URL,
    ],
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id; // Map userId to socket id
    console.log(`User ${userId} connected with socket id: ${socket.id}`);
  }
  //sends events to all conntected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId]; // Remove user from map on disconnect
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update all clients with the new list of online users
      console.log(`User ${userId} disconnected`);
    }
  });

  // Handle custom events here
  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}:`, data);
    // Broadcast the message to all connected clients
    io.emit("message", data);
  });
});

export { io, app, server };
//potential error can occur since the both names are the same
