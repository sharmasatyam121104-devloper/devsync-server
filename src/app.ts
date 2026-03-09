import express from "express"
import {requestLogger} from './utils/logger'

const app = express()

app.use(express.json())
app.use(requestLogger)

app.get("/", (req, res) => {
  res.send("DevSync API Running")
})

export default app