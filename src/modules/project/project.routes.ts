import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/user.middleware";
import { addMembersInProject, changeProjectStatus, createProject, getProject } from "./project.controller";

const ProjectRouter = Router()

ProjectRouter.post('/', AuthMiddleware, createProject)
ProjectRouter.get('/', AuthMiddleware, getProject)
ProjectRouter.post('/:projectId/add-members', AuthMiddleware, addMembersInProject)
ProjectRouter.get('/:projectId/change-status', AuthMiddleware, changeProjectStatus)

export default ProjectRouter