import { Router } from "express";
import { changePassword, forgotPassword, getSession, login, logOut, refreshToken, resendOtp, signup, verifyOtp } from "./user.controller";
import { changePasswordDtoSchema, forgotPasswordDtoSchema, getSessionDtoSchema, loginDtoSchema, refreshTokenDtoSchema, reSendOtpDtoSchema, signupDtoSchema, verifyOtpDtoSchema } from "./user.dto";
import { DtoMiddleware } from "../../middlewares/user.middleware";

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

export default UserRouter