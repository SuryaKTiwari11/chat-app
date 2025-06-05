import { Server } from "socket.io"
import http from 'http'
import express from "express";
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origins: ["http://localhost:3000"],
  },
});

     //listen for incoming connection on the server
     io.on("connection",(socket)=>{
        console.log("a user connected",socket.id)

        socket.on("disconnect",()=>{
            console.log(
                "user disconnected",socket.id
            )
        })
     })
export {io, app, httpServer as server}
//potential error can occur since the both names are the same