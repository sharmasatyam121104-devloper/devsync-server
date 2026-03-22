import { Router } from "express";
import { createMeeting, getMeetings } from "./meeting.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const MeetingRouter = Router()

MeetingRouter.post("/", AuthMiddleware, createMeeting);     
MeetingRouter.get("/", AuthMiddleware, getMeetings);  

export default MeetingRouter