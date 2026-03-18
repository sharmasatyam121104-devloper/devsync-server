import { Types } from "mongoose";

export interface ProjectInterface {
    _id: Types.ObjectId
    projectName: string
    description: string
    createdBy: Types.ObjectId 
    members: [
        {
        userId: Types.ObjectId,
        role: "LEAD" | "MEMBER"
        }
    ]
    status: "ACTIVE" | "COMPLETED"
    createdAt: Date
    updatedAt: Date
}