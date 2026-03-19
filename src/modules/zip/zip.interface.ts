export interface ZipInterface {
  fileId: string;
  projectId: string;

  fileName: string;
  fileUrl: string;
  filseDesciption: string;

  fileSize: number; // in bytes
  fileType: "zip";

  uploadedBy: string;

  createdAt: Date;
  updatedAt: Date;
}