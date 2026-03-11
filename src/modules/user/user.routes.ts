import { Router } from "express";
import { changePassword, forgotPassword, login, logOut, resendOtp, signup, verifyOtp } from "./user.controller";

const UserRouter = Router()

UserRouter.post('/signup', signup)
UserRouter.post('/login', login)
UserRouter.get('/logout', logOut)
UserRouter.post('/verify-otp', verifyOtp)
UserRouter.post('/resend-otp', resendOtp)
UserRouter.post('/forgot-password', forgotPassword)
UserRouter.post('/change-password', changePassword)

export default UserRouter