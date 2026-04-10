import { model, Schema } from "mongoose";
import { ReportInterface } from "./reports.interface";
import { models } from "mongoose";
import { timeStamp } from "node:console";

const reportSchema = new Schema<ReportInterface>({
    reporter: {
        types: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    reportedUser: {
        types: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },

    reason: {
        type: String,
        enum: [
            "spam",
            "abuse",
            "harassment",
            "hate_speech",
            "fake_account",
            "scam",
            "nudity",
            "violence",
            "misinformation",
            "impersonation",
            "bullying",
            "threat",
            "copyright_violation",
            "other",
        ],
        required : true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["pending" , "approved" , "rejected"],
        default: "pending"
    }
},
{ timestamps: true }
)


const ReportModel = models.Report || model<ReportInterface>("Report", reportSchema)

export default ReportModel