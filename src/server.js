import { io } from "socket.io-client"

const connectionOption = {
    forceNew: true,  
    reconnectionAttempts:Infinity,
    timeout:10000,
    transports:["websocket"]
}

const socket = io("http://localhost:3000",connectionOption)

export default socket