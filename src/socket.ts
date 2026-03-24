import { Server } from "socket.io";
import server from "./app";
import corsConfig from "./utils/cors";
import GroupChatSocket from "./modules/socket/groupChat.socket";

const io = new Server(server, { cors: corsConfig})

GroupChatSocket(io);

export default io;