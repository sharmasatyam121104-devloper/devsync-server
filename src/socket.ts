import { Server } from "socket.io";
import server from "./app";
import corsConfig from "./utils/cors";
import GroupChatSocket from "./modules/socket/groupChat.socket";
import GroupVideoCallSocket from "./modules/socket/groupVideoCall.socket";

const io = new Server(server, { cors: corsConfig})

GroupChatSocket(io);
GroupVideoCallSocket(io)

export default io;