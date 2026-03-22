import { Router } from "express";
import { changePassword, forgotPassword, getSession, getUserProfile, login, logOut, refreshToken, resendOtp, signup, verifyOtp } from "./user.controller";
import { changePasswordDtoSchema, forgotPasswordDtoSchema, loginDtoSchema, refreshTokenDtoSchema, reSendOtpDtoSchema, signupDtoSchema, verifyOtpDtoSchema } from "./user.dto";
import { AuthMiddleware, DtoMiddleware } from "../../middlewares/user.middleware";

const UserRouter = Router()

UserRouter.post('/signup', DtoMiddleware(signupDtoSchema), signup)
UserRouter.post('/login', DtoMiddleware(loginDtoSchema), login)
UserRouter.get('/logout', logOut)
UserRouter.post('/verify-otp', DtoMiddleware(verifyOtpDtoSchema), verifyOtp)
UserRouter.post('/resend-otp', DtoMiddleware(reSendOtpDtoSchema), resendOtp)
UserRouter.post('/forgot-password', DtoMiddleware(forgotPasswordDtoSchema), forgotPassword)
UserRouter.post('/change-password', DtoMiddleware(changePasswordDtoSchema), changePassword)
UserRouter.get("/refresh-token", refreshToken)
UserRouter.get('/session', getSession)
UserRouter.get('/user-profile', AuthMiddleware, getUserProfile) 

export default UserRouter