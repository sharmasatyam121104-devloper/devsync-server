import { catchError } from '../../utils/serverErrorhandler'
import { SessionInterface } from './user.interface'
import * as userService from './user.service'
import { Request, Response } from "express"

export const signup = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.signup(body)
        res.json(auth)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const login = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.login(body)
        res.cookie("accessToken", auth.accessToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_MAX_AGE),
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })
        res.cookie("refreshToken", auth.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) || 30 * 24 * 60 * 60 * 1000,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })

        res.json({message: "Login Success.", role: auth.role})
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const logOut = async(req: Request, res: Response)=>{
    try {
        res.cookie("accessToken", "", {
            httpOnly: true,
            maxAge: 0,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })
        res.cookie("refreshToken", "", {
            httpOnly: true,
            maxAge: 0,
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })

        res.json({message: "Logout Success."})
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const verifyOtp = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.verifyOtp(body)
        res.json(auth)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const resendOtp = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.reSendOtp(body)
        res.json(auth)
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const forgotPassword = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.forgotPassword(body)
        res.json(auth)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const changePassword = async(req: Request, res: Response)=>{
    try {
        const body = req.body
        const auth = await userService.changePassword(body)
        res.json(auth)
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const refreshToken = async(req: Request, res: Response)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        const result = await userService.refreshToken(refreshToken)

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_MAX_AGE),
            domain: process.env.CLIENT_DOMAIN,
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: false
        })      
        
        res.json({
        success: true,
        message: result.message
        })
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const getSession = async (req: Request, res: Response) => {
  try {

    const accessToken = req.cookies.accessToken

    const session = await userService.getSession(accessToken)

    return res.json(session)

  } catch (error) {
    return catchError(error, res)
  }
}


export const getUserProfile = async (req: SessionInterface, res: Response) => {
  try {

    const {role, id} = req.session!

    const userData = await userService.getUserProfile(role, id)

    return res.json(userData)

  } catch (error) {
    return catchError(error, res)
  }
}


