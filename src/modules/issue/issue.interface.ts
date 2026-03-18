import { Types } from "mongoose";

export interface IssueInterface {
    issueId: string;               
    projectId: Types.ObjectId;          
    title: string;                 
    description: string;           
    type: "Bug" | "Task" | "Improvement"; 
    status: "Open" | "In Progress" | "Closed"; 
    priority: "Low" | "Medium" | "High" | "Critical"; 
    assignedTo?: string;           
    createdBy: string;             
    createdAt: Date;               
    updatedAt: Date;               
    closedAt?: Date;               
    comments?: Array<{
        user: Types.ObjectId;                
        comment: string;             
        timestamp: Date;             
    }>;
}