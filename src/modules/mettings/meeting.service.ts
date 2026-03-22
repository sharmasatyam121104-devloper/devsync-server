import MeetingModel from "./meeting.model";
import ProjectModel from "../project/project.model";
import { tryError } from "../../utils/serverErrorhandler";

export const createMeeting = async (id: string, role: string, body: any) => {
  const { projectId, title, description, dateTime, meetingLink } = body;

  // 1. Project check
  const project = await ProjectModel.findById(projectId);
  if (!project) throw tryError("Project not found", 404);

  if (project.status !== "ACTIVE") {
    throw tryError("Project is not active", 403);
  }

  // 2. Member check
  const member = project.members.find(
    (m: any) => m.userId.toString() === id
  );

  if (!member) throw tryError("Not a project member", 403);

  if (member.role !== "LEAD") {
    throw tryError("Only LEAD can create meeting", 403);
  }

  // 3. Participants snapshot
  const participants = project.members.map((m: any) => m.userId);

  // 4. Create meeting
  const meeting = await MeetingModel.create({
    title,
    description,
    projectId,
    createdBy: id,
    participants,
    dateTime,
    meetingLink,
  });

  //  NEXT: BullMQ job yaha add hoga (baad me karenge)

  return {
    success: true,
    meeting,
  };
};


export const getMeetings = async (id: string, role: string) => {
  const now = new Date();

  const meetings = await MeetingModel.find({
    participants: id,
    dateTime: { $gte: now },
  }).sort({ dateTime: 1 });

  return {
    success: true,
    meetings,
  };
};