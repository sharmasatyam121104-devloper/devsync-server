import { catchError } from "../../utils/serverErrorhandler";
import { SessionInterface } from "../user/user.interface";
import { Response } from "express";
import * as projectService from "./project.service"

export const createProject = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!
        const body = req.body

        const project = await projectService.createProject(body, role, id)
        res.json(project)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const getProject = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!

        const projects = await projectService.getProject(role, id)
        res.json(projects)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const getSingleProject = async(req: SessionInterface, res: Response)=>{
    try {
        const {role, id} = req.session!
        const projectId = req.params.projectId as string

        const project = await projectService.getSingleProject(role, id, projectId)
        res.json(project)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}

export const addMembersInProject = async(req: SessionInterface, res: Response)=>{
    try {
        const  projectId  = req.params.projectId as string;
        const body = req.body;
        const {role, id} = req.session!

        const project = await projectService.addMembersInProject(body, projectId, role, id)
        res.json(project)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}
export const changeProjectStatus = async(req: SessionInterface, res: Response)=>{
    try {
        const  projectId  = req.params.projectId as string;
        const body = req.body;
        const {role, id} = req.session!

        const status = await projectService.changeProjectStatus(projectId, role, id)
        res.json(status)
    } 
    catch (error) {
        return catchError(error, res)    
    }
}