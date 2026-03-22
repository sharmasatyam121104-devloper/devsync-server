// middleware/apiLogger.ts

import { Request, Response, NextFunction } from "express";
import { createLog } from "../modules/apiLog/apiLog.service";

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      await createLog({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        time: Date.now() - start,
        user: (req as any).user?.email || "Guest",
        ip: req.ip || "",
        userAgent: req.headers["user-agent"] || "",
      });
    } catch (err) {
      console.error("Log Error:", err);
    }
  });

  next();
};