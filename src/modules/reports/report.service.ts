import { tryError } from "../../utils/serverErrorhandler"
import ProjectModel from "../project/project.model"
import ReportModel from "./reports.model"

export const createReport = async(role: string, id: string, body: any)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access", 401)
    }

    const projectId = body?.projectId 
    const reportedUserId = body?.reportedUserId
    const userId = id

    if(!projectId){
        throw tryError("Project id fields are missing", 400)
    }

    if(!reportedUserId){
        throw tryError("Reported userId is missing", 400)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project){
        throw tryError("Project not found", 404)
    }

    const members = project.members
    const membersIds = members.map((m: any)=>{
        return m.userId.toString()
    })

    const isReportedUserIdFoundInMembersList = membersIds.includes(reportedUserId.toString());
    console.log(isReportedUserIdFoundInMembersList);

    if(!isReportedUserIdFoundInMembersList){
        throw tryError("Reported User are not found in the given project id.", 403)
    }

    const isUserMemberOfProject = membersIds.find((id: string)=>(
        id === userId.toString()
    ))

    if(!isUserMemberOfProject){
        throw tryError("You are not member of this project", 403)
    }

    const reason = body.reason
    const description = body.description

    if(!reason){
        throw tryError("Reson is required.", 400)
    }

    if(!description){
        throw tryError("Description is required", 400)
    }

    const reportPayload = {
        reporter: userId,
        reportedUser: reportedUserId,
        reason,
        description
    }

    const report = await ReportModel.create(reportPayload)
    
    if(!report){
        throw tryError("Report not created due to some error, please try after sometimes.", 500)
    }

    return {message: "Report creted successfully."}
}

export const deletereport = async(role: string, id: string, body: any)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access", 401)
    }

    const userId = id
    const reportId = body?.reportId

    if(!reportId){
        throw tryError("Report id is required",400)
    }

    const report = await ReportModel.findById(reportId)

    if(!report){
        throw tryError("Report not found.", 404)
    }

    const reportStatus = report.status

    if(reportStatus !== "pending"){
        throw tryError("Report has already been processed by admin. Deletion is not allowed..", 403)
    }

    if(report.reporter.toString() !== userId.toString()){
        throw tryError("You are not allowed to delete this report", 403)
    }

    await ReportModel.findByIdAndDelete(reportId)

    return {message: "Report deleted sucessfully."}
}

export const updateReport = async(role: string, id: string, body: any)=>{
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access", 401)
    }

    const reportId = body?.reportId
    if(!reportId){
        throw tryError("Report id is required",400)
    }

    const report = await ReportModel.findById(reportId)
    if(!report){
        throw tryError("Report not found.", 404)
    }

    const status = body?.status
    if(!status){
        throw tryError("Status is required", 400)
    }

    if(status === report.status){
        throw tryError("Status is already the same", 400)
    }

    if(status !== "approved" && status !== "rejected"){
        throw tryError("Only 'approved' and 'rejected' status are allowed", 400)
    }

    const updatedReport = await ReportModel.findByIdAndUpdate(reportId, {status})
    //update in user model also
    // if(updateReport.
    // status === "approved"){

    // }

    return {message: `Status change to ${status}.`}
}

