import UserModel from './user.model'
import { tryError } from '../../utils/serverErrorhandler'
import sendMail from '../../utils/sendEmail'
import { otpTemplate } from '../../utils/otpTemplate'
import moment from 'moment'
import jwt from 'jsonwebtoken'
import { comparePassword, generateOTP, generateToken, getAccessToken, hashPassword } from './user.util'
import { ChangePasswordDto, ForgotPasswordDto, GetSessionDto, LoginDto, RefreshTokenDto, ReSendOtpDto, SignupDto, VerifyOtpDto } from './user.dto'
import { ChangePasswordResponse, ForgotPasswordResponse, GetSessionResponse, LoginResponseInterface, RefreshTokenResponse, ReSendOtpResponse, SignupResponse, VerifyOtpResponse } from './user.interface'



export const signup = async(body: SignupDto): Promise<SignupResponse> => {
  const { fullname, email, password } = body

  const existingUser = await UserModel.findOne({ email })

  if (existingUser) {
    throw tryError("Email already registered. Please login.", 401);
  }

  const hashedPassword = await hashPassword(password) 

  const otp = generateOTP()
  const otpExpireTime = moment().add(10, "minutes").toDate()

  const user = await UserModel.create({
    fullname,
    email,
    password: hashedPassword,
    otp,
    otpExpireTime,
    verify: false,
    role: "USER"
  })

  await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))


  return {
    success: true,
    message: "User created successfully. Please verify your email.",
    data: {email: user?.email, verify: user?.verify}
  }
}

export const login = async(body: LoginDto):Promise<LoginResponseInterface>=>{
  const {email, password} = body;

  const existingUser = await UserModel.findOne({ email })

  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  const isPasswordMatch = await comparePassword(password, existingUser.password)

  if(!isPasswordMatch) {
    throw tryError("Invalid credentials", 400);
  }

  const accessToken = await getAccessToken(existingUser)
  const refreshToken = generateToken()
  const refreshTokenExpiry = moment().add(30, "days").toDate()

  existingUser.refreshToken = refreshToken
  existingUser.refreshTokenExpiry = refreshTokenExpiry
  await existingUser.save()

  return {
    success: true,
    message: "you are logged in  successfully!",
    role: existingUser.role,
    accessToken,
    refreshToken
  }
}

export const verifyOtp = async(body: VerifyOtpDto): Promise<VerifyOtpResponse>=>{
  const {email, otp} = body;

  const existingUser = await UserModel.findOne({ email })

  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  if (moment().isAfter(existingUser.otpExpireTime)) {
    throw tryError("OTP has expired. Please request a new OTP.", 400);
  }
  
  if(otp !== existingUser.otp) {
    throw tryError("Invalid OTP", 400);
  }

  existingUser.verify = true
  existingUser.otp = undefined
  existingUser.otpExpireTime = undefined

  await existingUser.save()

  return {
    success: true,
    message: "Account verified successfully"
  }
}

export const reSendOtp = async(body: ReSendOtpDto): Promise<ReSendOtpResponse>=>{
  const {email} = body
  
  const existingUser = await UserModel.findOne({ email })
  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  const otp = generateOTP()
  const otpExpireTime = moment().add(10, "minutes").toDate()

  existingUser.otp = otp
  existingUser.otpExpireTime = otpExpireTime

  await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))
  await existingUser.save()

  return {
    success: true,
    message: "OTP resend successfully"
  }
}

export const forgotPassword = async(body: ForgotPasswordDto): Promise<ForgotPasswordResponse>=>{
    const {email} = body
  
  const existingUser = await UserModel.findOne({ email })
  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  const otp = generateOTP()
  const otpExpireTime = moment().add(10, "minutes").toDate()

  existingUser.otp = otp
  existingUser.otpExpireTime = otpExpireTime

  await sendMail(email, "Verify Your DevSync Account", otpTemplate(otp))
  await existingUser.save()

  return {
    success: true,
    message: "OTP send successfully"
  }
}

export const changePassword = async(body: ChangePasswordDto): Promise<ChangePasswordResponse>=>{
  const {email, newPassword, otp} = body

  const existingUser = await UserModel.findOne({ email })
  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  if (moment().isAfter(existingUser.otpExpireTime)) {
    throw tryError("OTP has expired. Please request a new OTP.", 400);
  }
  
  if(otp !== existingUser.otp) {
    throw tryError("Invalid OTP", 400);
  }

  existingUser.password = await hashPassword(newPassword)
  existingUser.verify = true
  existingUser.otp = undefined
  existingUser.otpExpireTime = undefined
  await existingUser.save()

  return {
    success: true,
    message: "Password chnaged successfully please login to continue services."
  }  

}

export const refreshToken = async( refreshToken: string ): Promise<RefreshTokenResponse>=>{
  if (!refreshToken) {
    throw tryError("Please provide refresh token.", 400)
  }

  const user = await UserModel.findOne({ refreshToken })

  if (!user) {
    throw tryError("User not found.", 404)
  }

  if (moment().isAfter(user.refreshTokenExpiry)) {
    throw tryError("Refresh token expired, Please login.", 401)
  }

  const accessToken = await getAccessToken(user)

  return {
    success: true,
    message: "Access token regenerated successfully!",
    accessToken,
    refreshToken
  }
}

export const getSession = async(accessToken: string): Promise<GetSessionResponse>=>{
  if (!accessToken) {
      throw tryError("Invalid session",401)
  }

  const session = await jwt.verify(accessToken, process.env.AUTH_SECRET!)
  return {
    success: true,
    session
  }
  
}

export const getUserProfile = async(role: string, id: string)=>{
  if(role !== "USER"){
    throw tryError("Unauthorized access", 403)
  }

  const userData = await UserModel.findById(id)

  return userData
}