import { Schema, model, models } from "mongoose";
import { ZipInterface } from "./zip.interface";

const zipSchema = new Schema<ZipInterface>(
  {
    projectId: { 
        type: String, 
        required: true 
    },
    fileName: { 
        type: String, 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true 
    },
    fileDesciption:{
        type: String
    },
    fileSize: { 
        type: Number, 
        required: true 
    },
    fileType: {
      type: String,
      enum: ["zip"],
      default: "zip",
    },

    uploadedBy: { type: String, required: true },
    uploaderName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ZipModel = models.Zip || model<ZipInterface>("Zip", zipSchema);