import bcrypt from 'bcrypt'
import UserModel from './user.model'
import { tryError } from '../../utils/serverErrorhandler'
import sendMail from '../../utils/sendEmail'
import { otpTemplate } from '../../utils/otpTemplate'
import moment from 'moment'
import crypto from "crypto";
import jwt, { SignOptions } from 'jsonwebtoken'

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const generateToken = (length = 64) => {
  return crypto.randomBytes(length).toString("hex");
};

const getAccessToken = async (auth:any ) => {

    const payload = {
      id: auth._id,
      email: auth.email,
      fullname: auth.fullname,
    }

    const secret = process.env.AUTH_SECRET
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY

    if (!secret) {
        throw new Error("Auth secret is missing.")
    }

    if (!expiresIn) {
        throw new Error("Access token expiry is missing.")
    }

    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    }

    const token = jwt.sign(payload, secret, options)

    return token
}

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


export const signup = async(body: any) => {
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

export const login = async(body: any)=>{
  const {email, password} = body;

  const existingUser = await UserModel.findOne({ email })

  if (!existingUser) {
    throw tryError("User not found, please registered first.", 404);
  }

  const isPasswordMatch = await comparePassword(password, existingUser.password)
  console.log(isPasswordMatch);

  if(!isPasswordMatch) {
    throw tryError("Invalid credentials", 400);
  }

  const accessToken = await getAccessToken(existingUser)
  const refreshToken = generateToken()

  existingUser.refreshToken = refreshToken
  await existingUser.save()

  return {
    success: true,
    message: "you are logged in  successfully!",
    accessToken,
    refreshToken
  }
}

export const verifyOtp = async(body: any)=>{
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

export const reSendOtp = async(body: any)=>{
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

export const forgotPassword = async(body: any)=>{
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

export const changePassword = async(body: any)=>{
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