import { Schema, model } from 'mongoose';
import { IssueInterface } from './issue.interface';
import { models } from 'mongoose';

const CommentSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },      
    comment: { 
        type: String, 
        required: true 
    },    
    timestamp: {
        type: Date, 
        default: Date.now 
    }  
});

const issueSchema = new Schema<IssueInterface>({
    projectId: {
        type: Schema.Types.ObjectId, 
        ref: "Project",
        required: true 
    },  
    title: { 
        type: String,
        required: true 
    },
    description: {
        type: String, 
        required: true 
    },
    type: {
        type: String, 
        enum: ['Bug', 'Task', 'Improvement'], 
        required: true 
    },
    status: { 
        type: String,
        enum: ['Open', 'In Progress', 'Closed'], 
        default: 'Open' 
    },
    priority: { 
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'], 
        default: 'Medium' 
    },
    assignedTo: { 
        type: String,
        default: null 
    },  
    createdBy: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
    closedAt: { 
        type: Date, 
        default: null 
    },
    comments: [CommentSchema]                     
});

// Automatically update `updatedAt` on every save
issueSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const IssueModel = models.Issue || model<IssueInterface>('Issue', issueSchema);