export interface ZipInterface {
  fileId: string;
  projectId: string;

  fileName: string;
  fileUrl: string;
  fileDesciption: string;

  fileSize: number; // in bytes
  fileType: "zip";

  uploadedBy: string;
  uploaderName: string;

  createdAt: Date;
  updatedAt: Date;
}