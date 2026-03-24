import { tryError } from "../../utils/serverErrorhandler";
import UserModel from "../user/user.model";
import ProjectModel from "./project.model";

export const createProject = async(body: any, role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const {projectName, description} = body
    const userId = id

    if (!projectName || !description) {
        throw tryError("Name and description are required",400)
    }

    const payload = {
        projectName,
        description,
        createdBy: userId,
        members: [
            {
            userId: userId,
            role: "LEAD",
            },
        ],
    }

    console.log(payload);

    const project = await ProjectModel.create(payload);

    return {
      success: true,
      message: "Project created successfully",
      data: project,
    };
}

export const getProject = async(role: string, id: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const userId = id

    const projects = await ProjectModel.find({
        "members.userId": userId,
    }).populate("members.userId", "email fullname")
    .sort({ createdAt: -1 })

    if(!projects){
        throw tryError("Project not found.",404)
    }

    return projects

}

export const getSingleProject = async(role: string, id: string, projectId: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const project = ProjectModel.findById(projectId)

    
    if(!project){
        throw tryError("Project not found.",404)
    }

    return project

}


export const addMembersInProject = async(body: any, projectId:string, role: string, id:string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project) {
        throw tryError("Project not found.",404)
    }

    if (project.createdBy.toString() !== id) {
        throw tryError(
        "You are not the lead of this project, only lead can add members",
        403
        );
    }

    if(project.status === "COMPLETED"){
        throw tryError("Project is already Complted, so you can't change the status.", 400);
    }

    const { emails } = body;

    if(emails.length === 0){
        throw tryError("Atleast one email are required.", 400);
    }

    const addingRequestMembers = await UserModel.find({
        email: { $in: emails },
    }).select("_id");

    // Existing member IDs
    const existingMemberIds = project.members.map((m: any) =>
        m.userId.toString()
    );

    // Requested IDs
    const requestedIds = addingRequestMembers.map((u: any) =>
        u._id.toString()
    );

    //  Filter (jo already member nahi hai)
    const newUserIds = requestedIds.filter(
        (id) => !existingMemberIds.includes(id)
    );

    //  Agar sab already member hai
    if (newUserIds.length === 0) {
        throw tryError("All users are already members", 400);
    }

    const newMembers = newUserIds.map((id) => ({
        userId: id,
        role: "MEMBER",
    }));

    project.members.push(...newMembers);

    await project.save();

    return project;

}

export const changeProjectStatus = async(projectId:string, role: string, id:string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access",403)
    }

    const project = await ProjectModel.findById(projectId)

    if(!project) {
        throw tryError("Project not found.",404)
    }

    if (project.createdBy.toString() !== id) {
        throw tryError(
        "You are not the lead of this project, only lead can cahnge status",
        403
        );
    }

    if(project.status === "COMPLETED"){
        throw tryError("Project is already Complted, so you can't change the status.", 400);
    }

    await ProjectModel.findByIdAndUpdate(projectId, {status: "COMPLETED"})
    return {message: "project status chaged successfully."}
}

