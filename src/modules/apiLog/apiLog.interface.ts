// interfaces/apiLog.interface.ts

export interface IApiLog {
  method: string;
  url: string;
  status: number;
  time: number;
  user: string;
  ip: string;
  userAgent: string;
  createdAt?: Date;
}