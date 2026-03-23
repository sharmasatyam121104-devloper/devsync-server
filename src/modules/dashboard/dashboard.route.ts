import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const DashboardRouter = Router();

DashboardRouter.get("/", AuthMiddleware, dashboardController);

export default DashboardRouter;