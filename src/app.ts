import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import {requestLogger} from './utils/logger'
import UserRouter from "./modules/user/user.routes"
import AdminRouter from "./modules/admin/admin.routes"
import ProjectRouter from "./modules/project/project.routes"
import IssueRouter from "./modules/issue/issue.route"
import ZipRouter from "./modules/zip/zip.routes"
import { apiLogger } from "./middlewares/apiLogger"
import ApiLogRouter from "./modules/apiLog/apiLog.routes"
import MeetingRouter from "./modules/mettings/meeting.routes"
import DashboardRouter from "./modules/dashboard/dashboard.route"
import MessageRouter from "./modules/message/mesasge.route"
import { createServer } from "http"
import corsConfig from "./utils/cors"
import ReportRouter from "./modules/reports/report.routes"

const app = express()
const server = createServer(app)


app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestLogger)
app.use(apiLogger)

app.get("/", (req, res) => {
  res.send("DevSync API Running")
})

app.use('/user',UserRouter)
app.use('/admin',AdminRouter)
app.use('/project',ProjectRouter)
app.use('/issue',IssueRouter)
app.use('/zip', ZipRouter)
app.use('/meeting', MeetingRouter)
app.use("/api-logs", ApiLogRouter);
app.use("/dashboard", DashboardRouter);
app.use('/message', MessageRouter)
app.use('/report', ReportRouter)

export default server