import { Server, Socket } from "socket.io";

interface GroupMessagePayload {
    projectId: string;
    message: string;
    sender: {
        id: string;
        fullname: string;
    };
}

const GroupChatSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("User connected:", socket.id);

        // join project group
        socket.on("join_group_chat", (projectId: string) => {
            if (!projectId) return;

            socket.join(projectId);
            console.log(`User joined project chat: ${projectId}`);
        });

        // send group message
        socket.on("send_group_message", (payload: GroupMessagePayload) => {
            try {
                if (!payload?.message?.trim()) return;

                const messageData = {
                    sender: payload.sender,
                    message: payload.message,
                    createdAt: new Date(),
                };

                io.to(payload.projectId).emit("receive_group_message", messageData);
            } 
            catch (error) {
                console.error("Group chat error:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
  });
};

export default GroupChatSocket;