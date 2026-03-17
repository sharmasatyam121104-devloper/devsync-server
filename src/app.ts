import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import {requestLogger} from './utils/logger'
import UserRouter from "./modules/user/user.routes"
import AdminRouter from "./modules/admin/admin.routes"

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

export default app