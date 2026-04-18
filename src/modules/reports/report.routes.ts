import { Router } from "express";
import { createReport, deleteReport, updateReport } from "./report.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const ReportRouter = Router()

ReportRouter.post('/', AuthMiddleware, createReport)
ReportRouter.delete('/', AuthMiddleware, deleteReport)
ReportRouter.put('/', AuthMiddleware, updateReport)

export default ReportRouter