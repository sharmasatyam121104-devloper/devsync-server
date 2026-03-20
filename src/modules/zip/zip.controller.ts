import { catchError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import * as ZipService from './zip.service'

export const uploadZip = async(req: SessionInterface, res: Response)=>{
    try {
        const {id, role} = req.session!
        const projectId = req.params.projectId as string
        const uploadedZip = await ZipService.uploadZip(projectId, id, role)
        res.json(uploadedZip)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const saveUploadedZip = async(req: SessionInterface, res: Response)=>{
    try {
        const body = req.body
        const {id, role, fullname} = req.session!
        const projectId = req.params.projectId as string
        const savedZip = await ZipService.saveUploadedZip(body, projectId, id, role, fullname)
        res.json(savedZip)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const zipHistory = async(req: SessionInterface, res: Response)=>{
    try {
        const {id, role} = req.session!
        const zipsFiles = await ZipService.zipHistory( id, role)
        res.json(zipsFiles)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const downloadZip = async(req: SessionInterface, res: Response)=>{
    try {
        const {id, role} = req.session!
        const zipId = req.params.zipId as string
        const downloadUrl = await ZipService.downloadZip(zipId, id, role)
        res.json(downloadUrl)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}