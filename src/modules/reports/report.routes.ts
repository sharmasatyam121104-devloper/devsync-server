import { Router } from "express";
import { createReport, deleteReport, getMyReports, updateReport } from "./report.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const ReportRouter = Router()

ReportRouter.post('/', AuthMiddleware, createReport)
ReportRouter.delete('/:reportId', AuthMiddleware, deleteReport)
ReportRouter.put('/', AuthMiddleware, updateReport)
ReportRouter.get('/', AuthMiddleware, getMyReports)

export default ReportRouter