import { catchError } from "../../utils/serverErrorhandler"
import { Response } from "express"
import * as adminService from './admin.service'
import { SessionInterface } from "../user/user.interface"

export const fetchUsers = async(req: SessionInterface, res: Response)=>{
    try {
        const {role} = req.session!
        const users = await adminService.fetchUser(role)
        res.json(users)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}


export const fetchActiveUsers = async(req: SessionInterface, res: Response)=>{
    try {
        const {role} = req.session!
        const activeUsers = await adminService.fetchActiveUser(role)
        res.json(activeUsers)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}


export const fetchBlockedUsers = async(req: SessionInterface, res: Response)=>{
    try {
        const {role} = req.session!
        const blockedUsers = await adminService.fetchBlockedUser(role)
        res.json(blockedUsers)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const serverStatus = async(req: SessionInterface, res: Response)=>{
    try {
        const {role} = req.session!
        const healthStatus = await adminService.serverStatus(role)
        res.json(healthStatus)
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const getAdminProfile = async(req: SessionInterface, res: Response)=>{
    try {
        const {role,id} = req.session!
        const profileData = await adminService.getAdminProfile(role,id)
        res.json(profileData)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const getAllReports = async(req: SessionInterface, res: Response)=>{
    try {
        const {role,id} = req?.session!
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        const reports = await adminService.getAllReports(role, page, limit)
        res.json(reports)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}