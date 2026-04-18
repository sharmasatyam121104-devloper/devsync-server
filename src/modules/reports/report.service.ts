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

