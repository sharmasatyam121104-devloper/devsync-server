import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import {requestLogger} from './utils/logger'

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

export default app