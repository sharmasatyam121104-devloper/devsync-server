import { model, models, Schema } from "mongoose";
import { ProjectInterface } from "./project.interface";

const projectSchema = new Schema<ProjectInterface>(
    {
        projectName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true           
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        members: [
            {
                userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                },
                role: {
                type: String,
                enum: ["LEAD", "MEMBER"],
                default: "MEMBER",
                },
                _id: false,
            },
        ],
        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED"],
            default: "ACTIVE",
        },

    },
    {
        timestamps: true, 
    }
)


const ProjectModel = models.Project || model<ProjectInterface>("Project", projectSchema);

export default ProjectModel;