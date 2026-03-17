import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload } from "jsonwebtoken";
import { SessionInterface } from "../modules/user/user.interface";
import { catchError, tryError } from "../utils/serverErrorhandler";

export const DtoMiddleware = (schema: any)=>(req: Request, res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body)
   
    if(!result.success) {
        res.status(400).json({message: "Validation failed", errors: result.error.format()})
        return
    }

    req.body = result.data
    next()
}


export const AuthMiddleware = async(req: SessionInterface, res:Response, next:NextFunction)=>{
    try {
        const accessToken = req.cookies?.accessToken

        if(!accessToken){
            throw tryError("Failed to authorize user",401)
        }

        const payload = await jwt.verify(accessToken, process.env.AUTH_SECRET!) as JwtPayload
        req.session = {
            id: payload.id,
            email: payload.email,
            fullname: payload.fullname,
            role: payload.role
        }
        
        next()
    } catch (error) {
        return catchError(error, res, "Invalid Session");
    }
}
