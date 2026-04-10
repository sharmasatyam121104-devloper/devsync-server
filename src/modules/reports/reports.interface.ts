import { Document, Types } from "mongoose";

export type ReportReason =
  | "spam"
  | "abuse"
  | "harassment"
  | "hate_speech"
  | "fake_account"
  | "scam"
  | "nudity"
  | "violence"
  | "misinformation"
  | "impersonation"
  | "bullying"
  | "threat"
  | "copyright_violation"
  | "other";

export interface ReportInterface extends Document {
  _id: Types.ObjectId;

  reporter: Types.ObjectId;        
  reportedUser: Types.ObjectId;

  reason: ReportReason;
  description?: string;           

  status: "pending" | "approved" | "rejected"; 

  createdAt?: Date;
  updatedAt?: Date;
}