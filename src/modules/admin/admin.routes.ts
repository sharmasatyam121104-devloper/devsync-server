import { Router } from "express";
import { fetchActiveUsers, fetchBlockedUsers, fetchUsers, getAdminProfile, getAllReports, serverStatus } from "./admin.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const AdminRouter = Router()

AdminRouter.get('/users', AuthMiddleware, fetchUsers)
AdminRouter.get('/active-users', AuthMiddleware, fetchActiveUsers)
AdminRouter.get('/blocked-users', AuthMiddleware, fetchBlockedUsers)

AdminRouter.get('/server-status', AuthMiddleware, serverStatus)

AdminRouter.get('/admin-profile', AuthMiddleware, getAdminProfile)

AdminRouter.get('/reports', AuthMiddleware, getAllReports)

export default AdminRouter