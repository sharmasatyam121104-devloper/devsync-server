import  { model, models, Schema } from "mongoose";
import { IMeeting } from "./meeting.interface";

const MeetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    dateTime: {
      type: Date,
      required: true,
      index: true,
    },

    meetingLink: {
      type: String,
      required: true,
      trim: true,
    },

    joinEnabled: {
      type: Boolean,
      default: false,
    },

    notified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },
  },
  {
    timestamps: true,
  }
);

const MeetingModel = models.Meeting || model<IMeeting>("Meeting", MeetingSchema);

export default MeetingModel