// meeting.controller.ts

import { Response } from "express";
import * as MeetingService from "./meeting.service";
import { SessionInterface } from "../user/user.interface";
import { catchError } from "../../utils/serverErrorhandler";

export const createMeeting = async (req: SessionInterface, res: Response) => {
    try {
        const {id, role} = req.session!
        const body = req.body
        const result = await MeetingService.createMeeting(id, role, body);
        res.json(result);
    }
    catch (error) {
       return catchError(error, res) 
    }
};

export const getMeetings = async (req: SessionInterface, res: Response) => {
    try {
        const {id, role} = req.session!
        const result = await MeetingService.getMeetings(id, role);
        res.json(result);
    }
    catch (error) {
        return catchError(error, res)
    }
};


export const getSingleMeeting = async (req: SessionInterface, res: Response) => {
    try {
        const {id, role} = req.session!
        const meetingId = req.params.meetingId as string
        const meeting = await MeetingService.getSingleMeeting(id, role, meetingId);
        res.json(meeting);
    }
    catch (error) {
        return catchError(error, res)
    }
};