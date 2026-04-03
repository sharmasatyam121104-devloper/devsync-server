import { Server } from "socket.io"

const userSocketMap = new Map<string, string>();

const GroupVideoCallSocket = async (io: Server) => {

    io.on("connection", (socket) => {

        // ✅ register user
        socket.on("register", (userId) => {
            userSocketMap.set(userId, socket.id);
            console.log("User registered:", userId, socket.id);
        });

        socket.on("join-room", (roomId) => {
            socket.join(roomId)
            console.log("joined:", roomId)
        })

        socket.on("offer", (payload) => {
            const targetSocketId = userSocketMap.get(payload.to);

            if (targetSocketId) {
                io.to(targetSocketId).emit("offer", {
                    offer: payload.offer,
                    from: payload.from,
                    roomId: payload.roomId
                });
            }
        });

        socket.on("candidate", (payload) => {
            const targetSocketId = userSocketMap.get(payload.to);

            if (targetSocketId) {
                io.to(targetSocketId).emit("candidate", {
                    candidate: payload.candidate,
                    from: payload.from
                });
            }
        });

        socket.on("answer", (payload) => {
            const targetSocketId = userSocketMap.get(payload.to);

            if (targetSocketId) {
                io.to(targetSocketId).emit("answer", {
                    answer: payload.answer,
                    from: payload.from
                });
            }
        });

        

        socket.on("disconnect", () => {
            for (let [userId, sockId] of userSocketMap.entries()) {
                if (sockId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });

    })
}

export default GroupVideoCallSocket