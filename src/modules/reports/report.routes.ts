import { Router } from "express";
import { createReport } from "./report.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const ReportRouter = Router()

ReportRouter.post('/', AuthMiddleware, createReport)

export default ReportRouter