import { tryError } from "../../utils/serverErrorhandler"
import ProjectModel from "../project/project.model"
import { IssueModel } from "./issue.model"

export const craeteIssue = async(body: any, projectId: string, role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    if(!projectId){
        throw tryError("ProjectId required",400)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project) {
        throw tryError("Project not found",404)
    }

    const memberIds = project.members.map((member: any) => member.userId.toString())
    const isMember = memberIds.includes(memberIds.toString())

    if (!isMember) {
        throw tryError("You can not create issue, you are not the meber of this project!", 403);
    }

    const {title, description, type, priority, assignedTo} = body
    const createdBy = id

    const isAsigndeMemebr = memberIds.includes(assignedTo.toString())
    if (!isAsigndeMemebr) {
        throw tryError("You can not assign  issue to this member , He/She are not the member of this project!", 403);
    }

    const payload = {
        projectId,
        title,
        description,
        type,
        priority: priority || "Medium",
        assignedTo,
        createdBy
    }

    await IssueModel.create(payload)
    return {mesaage: "Issue created sucessfully."}
}

export const getAllIssueOfUser = async(role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const yourIssues = await IssueModel.find({$or:[{createdBy: id}, {assignedTo: id}]})
    return yourIssues
}

export const getAllActiveIssueOfUser = async(role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const yourActiveIssues = await IssueModel.find({$or:[{createdBy: id}, {assignedTo: id}], status: "Open"})
    return yourActiveIssues
}

export const getAllColseIssueOfUser = async(role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const yourCloseIssues = await IssueModel.find({$or:[{createdBy: id}, {assignedTo: id}], status: "Closed"})
    return yourCloseIssues
}

export const updateStatusIssue = async(body: any, issueId: string, role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    if(!issueId){
        throw tryError("IssueId required",400)
    }

    const issue = await IssueModel.findById(issueId)

    if(!issue) {
        throw tryError("Issue not found",404)
    }

    if(issue.status === "Closed"){
        throw tryError("Issue already close, now you can't change the status.",400)
    }

    if(issue.assignedTo.toString() === id.toString){
        throw tryError("You dont have access to change the status of issue.",400)
    }

    const status = body.status
    if(!status) {
        throw tryError("status required",400)
    }

    if(status === "In Progress"){
        await IssueModel.findByIdAndUpdate(issueId, {status})
        return {message: "Issue status update sucessfully"}
    }

    if(status === "Closed"){
        const closedAt = Date.now()
        await IssueModel.findByIdAndUpdate(issueId, {status, closedAt})
        return {message: "Issue status update sucessfully"}
    }
}

export const createCommnetInIssue = async(body: any, issueId: string, role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    if(!issueId){
        throw tryError("IssueId required",400)
    }

    const issue = await IssueModel.findById(issueId)

    if(!issue) {
        throw tryError("Issue not found",404)
    }

    if(issue.status === "Closed"){
        throw tryError("Issue already close, now you can't change the status.",400)
    }

    // Check if user is the Assignee
    const isAssignee = issue.assignedTo?.toString() === id;

    // Check if user is the Project Lead
    const isLead = issue.createdBy?.toString() === id;

    // Agar dono mein se koi bhi nahi hai, toh block kar do
    if (!isAssignee && !isLead) {
        throw tryError("Only the Assignee or Project Lead can comment on this issue.", 403);
    }

    const comment = body.comment

    if(!comment){
        throw tryError("Comment is required",400)
    }

    const newComment = {
        user: id,
        comment: comment,
        timestamp: new Date()
    };

        await IssueModel.findByIdAndUpdate(
        issueId,
        { 
            $push: { comments: newComment }, 
            $set: { updatedAt: new Date() } 
        }
        )
    return {message: "Comment send successfully."}
};
