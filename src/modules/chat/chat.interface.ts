import { Document, Types } from "mongoose";

export interface IChat extends Document {
  projectId: Types.ObjectId;
  members: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}