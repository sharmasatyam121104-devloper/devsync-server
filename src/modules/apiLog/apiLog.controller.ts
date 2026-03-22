// controllers/apiLog.controller.ts

import { Request, Response } from "express";
import * as apiLogService from "./apiLog.service"

export const getApiLogs = async (req: Request, res: Response) => {
  try {
    const data = await apiLogService.getLogs(req.query);

    res.status(200).json({
      success: true,
      logs: data.logs,           
      pagination: data.pagination, 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
    });
  }
};