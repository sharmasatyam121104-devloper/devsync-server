import { getDownloadSignedUrl, getUploadSignedUrl } from "../../utils/s3"
import { tryError } from "../../utils/serverErrorhandler"
import ProjectModel from "../project/project.model"
import { ZipModel } from "./zip.model"

export const uploadZip = async(projectId: string, id: string, role: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    if(!projectId){
        throw tryError("ProjectId required",400)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project){
        throw tryError("Project not found.", 404)
    }

    if(project.status === "COMPLTED"){
        throw tryError("You can't upload zip file in this project,because this project is completed.", 400)
    }

    const projectMembersIds = project.members.map((m: any)=>(
        m.userId.toString()
    ))

    const isGivenIdMatchInProjectMembersIds = projectMembersIds.includes(id.toString())

    if(!isGivenIdMatchInProjectMembersIds){
        throw tryError("You can't upload zip file in this project,you are not member.", 400)
    }

    const uploadUrl = await getUploadSignedUrl(projectId)


    return uploadUrl
}

export const saveUploadedZip = async (body: any, projectId: string, id: string, role: string, fullname: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    if(!projectId){
        throw tryError("ProjectId required",400)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project){
        throw tryError("Project not found.", 404)
    }

    if(project.status === "COMPLTED"){
        throw tryError("You can't upload zip file in this project,because this project is completed.", 400)
    }

    const projectMembersIds = project.members.map((m: any)=>(
        m.userId.toString()
    ))

    const isGivenIdMatchInProjectMembersIds = projectMembersIds.includes(id.toString())

    if(!isGivenIdMatchInProjectMembersIds){
        throw tryError("You can't upload zip file in this project,you are not member.", 400)
    }

    const url = body.key
    if(!url) {
        throw tryError("Zip url is required.",400)
    }

    const payload = {
        projectId,
        fileName : body.fileName,
        fileUrl: url,
        fileDesciption: body.fileDesciption,
        fileSize: body.fileSize,
        uploadedBy: id,
        uploaderName: fullname,
    }

    const zip = await ZipModel.create(payload)
    return zip
}


export const zipHistory = async( id: string, role: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const userId = id

    const projects = await ProjectModel.find({
        "members.userId": userId,
    });

    const projectMap: any = {};
    projects.forEach((p: any) => {
        projectMap[p._id.toString()] = p.projectName;
    });

    if(!projects){
        throw tryError("Project not found.",404)
    }

    const projectIds = projects.map((p: any)=>(
        p._id.toString()
    ))

    const zips = await ZipModel.find({projectId: { $in: projectIds }})
    .select("fileName fileUrl fileDesciption fileSize uploadedBy uploaderName createdAt projectId")

    if(!zips) {
        throw tryError("Project not found.", 404)
    }

    const result = zips.map((zip: any) => ({
        ...zip.toObject(),
        projectName: projectMap[zip.projectId],
    }));

    return result
}

export const downloadZip = async(zipId: string,id: string, role: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const userId = id

    const projects = await ProjectModel.find({
        "members.userId": userId,
    });

    const projectMap: any = {};
    projects.forEach((p: any) => {
        projectMap[p._id.toString()] = p.projectName;
    });

    if(!projects){
        throw tryError("Project not found.",404)
    }

    const projectIds = projects.map((p: any)=>(
        p._id.toString()
    ))

    const zip = await ZipModel.findOne({
        _id: zipId,
        projectId: { $in: projectIds },
    }).select("fileUrl");

    const key = zip.fileUrl

    const downloadUrl = await getDownloadSignedUrl(key)
    return downloadUrl
}