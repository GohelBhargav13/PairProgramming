import express from "express"
import http from "http"
import { Server } from "socket.io";
import ACTIONS from "./src/Actions.js"

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5174","http://localhost:5173"],
        methods:["GET","POST"]
    }
});

// ALL THE CONNECTED CLIENT
const allUsers = {}

// FETCH ALL CLIENT USING ROOM ID
function getAllClient(roomId){
    // RETURN TYPE OF IO.SOCKETS.ADAPTER.ROOM IS MAP SO CONVERT IT INTO ARRAY
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username:allUsers[socketId]
        }
    })
}

io.on('connection',(socket) => {
    const { id } = socket;
    console.log("Socket ID : ", id);

    // ADD THE NEW MEMBER IN THE OBJECT AND JOIN THE ROOM
    socket.on(ACTIONS.JOIN,({ roomId,username }) => {
        console.log(username);

        //CHECK IF THE USER ALREADY EXIST IN THE OBJECT
        allUsers[id] = username;
        socket.join(roomId);

        const client = getAllClient(roomId);
        console.log(client)
        
        client.forEach(({socketId}) => {
             io.to(socketId).emit(ACTIONS.JOINED,{
                socketId:id,
                username,
                client
            })
        })
    })

    // SEND THE CODE TO THE ALL CLIENTS
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code}) => {
        const user = allUsers[socket.id];
        console.log(user);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{ code,user })
    })


    socket.on("disconnecting",() => {
        // GOT THE ALL ROOMS ON SOCKET
        const rooms = Array.from(socket.rooms);
        // LOOP IN EACH ROOM 
        rooms.forEach((room) => {
            socket.in(room).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:allUsers[socket.id]
            })
        })

        delete allUsers[socket.id]
        socket.leave()
    })  


})


const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`App is running on port ${PORT}`));

