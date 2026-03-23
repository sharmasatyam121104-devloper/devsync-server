import { tryError } from "../../utils/serverErrorhandler"
import ProjectModel from "../project/project.model"
import ChatModel from "../chat/chat.model"
import MessageModel from "./message.model"

export const sendMessage = async(body: any, projectId: string, id: string, role: string)=>{
    if(role !== "USER"){
        throw tryError("Unauthorized Access", 403)
    }

    if (!body?.message?.trim()) {
        throw tryError("Message cannot be empty", 400);
    }

    const project = await ProjectModel.findById(projectId);
        if (!project) {
        throw tryError("Project not found", 404);
    }

    const userId = id;

    if (project.status === "COMPLETED") {
        throw tryError(
            "Project is completed, you cannot send message",
            403
        );
    }

    const projectMemberIds = project.members.map((m: any) =>
        m.userId.toString()
    );

    const isUserPresentInMembers = projectMemberIds.includes(userId);

    if (!isUserPresentInMembers) {
        throw tryError("You are not member of this project", 403);
    }

    let chat = await ChatModel.findOne({ projectId });

    if (!chat) {
        chat = await ChatModel.create({
            projectId,
            members: projectMemberIds,
        });
    }

    const messagePayload = {
        chatId: chat._id,
        senderId: userId,
        text: body.message,
    };

    const message = await MessageModel.create(messagePayload);

    await ChatModel.findByIdAndUpdate(chat._id, {
        lastMessage: message._id,
    });

    return message;

}

export const getMessages = async (projectId: string, id: string, role: string, page: number = 1, limit: number = 20) => {
    if (role !== "USER") {
        throw tryError("Unauthorized Access", 403);
    }

    //  Find chat
    const chat = await ChatModel.findOne({ projectId });

    if (!chat) {
        return {
            messages: [],
            hasMore: false,
        };
    }

    const project = await ProjectModel.findById(projectId)

    //  Pagination logic
    const skip = (page - 1) * limit;

    //  Get messages (latest first)
    const messages = await MessageModel.find({ chatId: chat._id })
    .populate("senderId", "fullname")
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit);

    //  Check more messages
    const total = await MessageModel.countDocuments({ chatId: chat._id });

    return {
        messages: messages.reverse(), 
        hasMore: skip + limit < total,
        projectName : project.projectName
    };
};