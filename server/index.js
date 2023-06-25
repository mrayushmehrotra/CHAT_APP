const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const { ppid, disconnect } = require("process");

const users=[{}]
const app = express();
const port = 4500 || process.env.PORT
app.use(cors())
const server = http.createServer(app);
const io = socketIO(server);
app.get("/",(req,res)=>{
    res.send("Server")
})

io.on("connection", (socket)=>{
    
    socket.on("joined", ({user})=>{
        users[socket.id]=user
       
        socket.broadcast.emit(`userJoined`, {user:"Admin", message:`${users[socket.id]} has joined`})
        socket.emit("welcome", {user:"Admin",message:`Welcome To The Chat ${users[socket.id]}`})
    })

    socket.on("message",({message,id})=>{
        io.emit("sendMessage", {user:users[socket.id],message,id});
    })

    socket.on("disconnected", ()=>{
        socket.broadcast.emit("leave", {user:"Admin", message: `${users[socket.id]} has left`})
    })
})

server.listen(port, (()=>{
    console.log(`server is working on http://localhost:${port}`)
}))