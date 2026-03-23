import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/user.middleware";
import { getMessages, sendMessage } from "./message.controller";

const MessageRouter = Router()

MessageRouter.post('/:projectId', AuthMiddleware, sendMessage)
MessageRouter.get('/:projectId', AuthMiddleware, getMessages)
export default MessageRouter