import { Router } from "express";
import { createMeeting, getMeetings, getSingleMeeting } from "./meeting.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const MeetingRouter = Router()

MeetingRouter.post("/", AuthMiddleware, createMeeting);     
MeetingRouter.get("/", AuthMiddleware, getMeetings);  
MeetingRouter.get("/:meetingId", AuthMiddleware, getSingleMeeting);  

export default MeetingRouter