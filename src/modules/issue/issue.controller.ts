import { catchError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import * as ProjectService  from "./issue.service"

export const craeteIssue = async(req: SessionInterface, res: Response)=>{
    try {
        const projectId = req.params.projectId as string
        const {role, id} = req.session!
        const body = req.body
        const issue = await ProjectService.createIssue(body, projectId, role, id)
        res.json(issue)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const getAllIssueOfUser = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!
        const yourIssues = await ProjectService.getAllIssueOfUser(role, id)
        res.json(yourIssues)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const getAllActiveIssueOfUser = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!
        const yourActiveIssues = await ProjectService.getAllActiveIssueOfUser(role, id)
        res.json(yourActiveIssues)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const getAllCloseIssueOfUser = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!
        const yourCloseIssues = await ProjectService.getAllColseIssueOfUser(role, id)
        res.json(yourCloseIssues)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const updateStatusIssue = async(req: SessionInterface, res: Response)=>{
    try {
        const issueId = req.params.issueId as string
        const {role, id} = req.session!
        const body = req.body
        const yourCloseIssues = await ProjectService.updateStatusIssue(body, issueId, role, id)
        res.json(yourCloseIssues)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

export const createCommnetInIssue = async(req: SessionInterface, res: Response)=>{
    try {
        const issueId = req.params.issueId as string
        const {role, id} = req.session!
        const body = req.body
        const comment = await ProjectService.createCommnetInIssue(body, issueId, role, id)
        res.json(comment)
    } 
    catch (error) {
        return catchError(error, res)
    }
}

