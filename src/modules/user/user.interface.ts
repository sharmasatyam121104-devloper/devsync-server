import { Document, Types } from "mongoose";
import { Request } from "express";

export interface UserInterface extends Document {
    _id: Types.ObjectId
    fullname: string
    email: string
    password: string
    otp?: string
    otpExpireTime?: Date
    verify: boolean
    accessToken?: string
    refreshToken?: string
    refreshTokenExpiry?: Date
    role: "ADMIN" | "USER"
    status: "ACTIVE" | "BLOCK"
}


export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    email: string | undefined;
    verify: boolean | undefined;
  };
}


export interface LoginResponseInterface {
  success: boolean;
  message: string;
  role: "USER" | "ADMIN";
  accessToken: string;
  refreshToken: string;
}


export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ReSendOtpResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}


export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}


export interface SessionPayload {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}


export interface SessionInterface extends Request{
  session? : SessionPayload  
}

export interface GetSessionResponse {
  success: boolean;
  session: any;
}