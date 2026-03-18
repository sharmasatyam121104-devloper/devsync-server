import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/user.middleware";
import { addMembersInProject, createProject, getProject } from "./project.controller";

const ProjectRouter = Router()

ProjectRouter.post('/', AuthMiddleware, createProject)
ProjectRouter.get('/', AuthMiddleware, getProject)
ProjectRouter.get('/:projectId/members', AuthMiddleware, addMembersInProject)

export default ProjectRouter