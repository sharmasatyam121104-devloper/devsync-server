import { Router } from "express"
import { AuthMiddleware } from "../../middlewares/user.middleware"
import { downloadZip, saveUploadedZip, uploadZip, zipHistory } from "./zip.controller"

const ZipRouter = Router()

ZipRouter.post('/:projectId', AuthMiddleware, uploadZip)
ZipRouter.post('/save-zip/:projectId', AuthMiddleware, saveUploadedZip)
ZipRouter.get('/zip-history', AuthMiddleware, zipHistory)
ZipRouter.get('/download-zip/:zipId', AuthMiddleware, downloadZip)


export default ZipRouter