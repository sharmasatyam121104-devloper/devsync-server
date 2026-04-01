import { Server } from "socket.io"

const GroupVideoCallSocket = async(io: Server)=>{
    io.on("connection", (socket)=>{
        socket.on("join-room", (roomId) => {
            socket.join(roomId)
            console.log("joined:", roomId)
        })

        socket.on("offer", (payload) => {
            socket.to(payload.roomId).emit("offer", payload)
        })
    
    })
}

export default GroupVideoCallSocket

