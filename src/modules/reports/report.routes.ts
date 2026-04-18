import { Router } from "express";
import { createReport, deleteReport } from "./report.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const ReportRouter = Router()

ReportRouter.post('/', AuthMiddleware, createReport)
ReportRouter.delete('/', AuthMiddleware, deleteReport)

export default ReportRouter