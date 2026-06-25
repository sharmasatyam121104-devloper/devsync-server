// models/apiLog.model.ts

import mongoose, { Schema, Document } from "mongoose";
import { IApiLog } from "./apiLog.interface";

export interface IApiLogDocument extends IApiLog, Document {}

const apiLogSchema: Schema = new Schema(
  {
    method: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: Number, required: true },
    time: { type: Number, required: true },
    user: { type: String, default: "Guest" },
    ip: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IApiLogDocument>("ApiLog", apiLogSchema);