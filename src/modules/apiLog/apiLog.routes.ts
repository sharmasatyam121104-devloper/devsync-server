// routes/apiLog.routes.ts

import express from "express";
import { getApiLogs } from "./apiLog.controller";

const ApiLogRouter = express.Router();

// GET all logs
ApiLogRouter.get("/", getApiLogs);

export default ApiLogRouter;