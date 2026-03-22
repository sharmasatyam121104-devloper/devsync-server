import { Types } from "mongoose";

export interface IMeeting {
  title: string;
  description?: string;

  projectId: Types.ObjectId;
  createdBy: Types.ObjectId;

  participants: string[];

  dateTime: Date;
  meetingLink: string;

  joinEnabled: boolean; 
  notified: boolean; 

  status: "UPCOMING" | "ONGOING" | "COMPLETED";

  createdAt?: Date;
  updatedAt?: Date;
}