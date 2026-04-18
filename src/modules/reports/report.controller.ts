import { Response } from "express";
import { catchError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import * as ReportService from './report.service'

export const createReport = async(req: SessionInterface, res: Response)=>{
    try {
        const role = req?.session?.role as string
        const id = req?.session?.id as string
        const body = req.body
        const report = await ReportService.createReport(role, id, body)
        res.json(report)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const deleteReport = async(req: SessionInterface, res: Response)=>{
    try {
        const role = req?.session?.role as string
        const id = req?.session?.id as string
        const reportId = req.params.reportId as string
        const report = await ReportService.deletereport(role, id, reportId)
        res.json(report)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const updateReport = async(req: SessionInterface, res: Response)=>{
    try {
        const role = req?.session?.role as string
        const id = req?.session?.id as string
        const body = req.body
        const report = await ReportService.updateReport(role, id, body)
        res.json(report)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const getMyReports = async(req: SessionInterface, res: Response)=>{
    try {
        const role = req?.session?.role as string
        const id = req?.session?.id as string
        const report = await ReportService.getMyReports(role, id)
        res.json(report)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}