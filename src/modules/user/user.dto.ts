import { z } from "zod";

export const signupDtoSchema = z.object({
  fullname: z.string().min(1, "Fullname is required!"),
  email: z.email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters")
}).strict();


export const loginDtoSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters")
}).strict();


export const verifyOtpDtoSchema = z.object({
  email: z.email("Enter a valid email."),
  otp: z.string().min(4, "OTP is required")  
}).strict();

export const reSendOtpDtoSchema = z.object({
  email: z.email("Enter a valid email.")
}).strict();


export const forgotPasswordDtoSchema = z.object({
  email: z.email("Enter a valid email.")
}).strict();


export const changePasswordDtoSchema = z.object({
  email: z.email("Enter a valid email."),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().min(4, "OTP is required")
}).strict();

export const refreshTokenDtoSchema = z.object({
  refreshToken: z.string().min(1, "Please provide refresh token")
}).strict();


export const getSessionDtoSchema = z.object({
  accessToken: z.string().min(1, "Access token is required")
}).strict();



export type SignupDto = z.infer<typeof signupDtoSchema>;
export type LoginDto = z.infer<typeof loginDtoSchema>;
export type VerifyOtpDto = z.infer<typeof verifyOtpDtoSchema>;
export type ReSendOtpDto = z.infer<typeof reSendOtpDtoSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordDtoSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordDtoSchema>;
export type RefreshTokenDto = z.infer<typeof refreshTokenDtoSchema>;
export type GetSessionDto = z.infer<typeof getSessionDtoSchema>;