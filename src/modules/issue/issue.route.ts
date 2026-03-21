import { Router } from "express";
import { craeteIssue, createCommnetInIssue, getAllActiveIssueOfUser, getAllCloseIssueOfUser, getAllIssueOfUser, updateStatusIssue } from "./issue.controller";
import { AuthMiddleware } from "../../middlewares/user.middleware";

const IssueRouter = Router()

IssueRouter.post('/:projectId',AuthMiddleware, craeteIssue)
IssueRouter.get('/',AuthMiddleware, getAllIssueOfUser)
IssueRouter.get('/active-issue',AuthMiddleware, getAllActiveIssueOfUser)
IssueRouter.get('/close-issue',AuthMiddleware, getAllCloseIssueOfUser)
IssueRouter.patch('/update-issue/:issueId',AuthMiddleware, updateStatusIssue)
IssueRouter.post('/create-commnet/:issueId',AuthMiddleware, createCommnetInIssue)

export default IssueRouter