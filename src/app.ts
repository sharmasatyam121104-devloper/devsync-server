import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import {requestLogger} from './utils/logger'
import UserRouter from "./modules/user/user.routes"
import AdminRouter from "./modules/admin/admin.routes"
import ProjectRouter from "./modules/project/project.routes"
import IssueRouter from "./modules/issue/issue.route"
import ZipRouter from "./modules/zip/zip.routes"

const app = express()


app.use(cors({
  origin: process.env.CLIENT,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("DevSync API Running")
})

app.use('/user',UserRouter)
app.use('/admin',AdminRouter)
app.use('/project',ProjectRouter)
app.use('/issue',IssueRouter)
app.use('/zip', ZipRouter)

export default app