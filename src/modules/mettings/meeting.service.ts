import MeetingModel from "./meeting.model";
import ProjectModel from "../project/project.model";
import { tryError } from "../../utils/serverErrorhandler";
import { addMeetingReminderJob } from "./meeting.job";

export const createMeeting = async (id: string, role: string, body: any) => {
  const { projectId, title, description, dateTime, meetingLink } = body;

  const meetingTime = new Date(dateTime);
  const now = new Date();

  // 1. Past date check
  if (meetingTime <= now) {
    throw tryError("Meeting time must be in the future", 400);
  }

  // 2. Project check
  const project = await ProjectModel.findById(projectId);
  if (!project) throw tryError("Project not found", 404);

  if (project.status !== "ACTIVE") {
    throw tryError("Project is not active", 403);
  }

  // 3. Member check
  const member = project.members.find(
    (m: any) => m.userId.toString() === id
  );

  if (!member) throw tryError("Not a project member", 403);

  if (member.role !== "LEAD") {
    throw tryError("Only LEAD can create meeting", 403);
  }

  //  4. Conflict check (±1 hour)
  const start = new Date(meetingTime.getTime() - 60 * 60 * 1000);
  const end = new Date(meetingTime.getTime() + 60 * 60 * 1000);

  const existingMeeting = await MeetingModel.findOne({
    projectId,
    dateTime: {
      $gte: start,
      $lte: end,
    },
  });

  if (existingMeeting) {
    throw tryError(
      "Another meeting exists within 1 hour of this time",
      400
    );
  }

  // 5. Participants snapshot
  const participants = project.members.map((m: any) => m.userId);

  // 6. Create meeting
  const meeting = await MeetingModel.create({
    title,
    description,
    projectId,
    createdBy: id,
    participants,
    dateTime
  });

  // 7. Add queue job
  await addMeetingReminderJob(
    meeting._id.toString(),
    dateTime
  );

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

  //  Transform response
  const formattedMeetings = meetings.map((meeting) => ({
    _id: meeting._id,
    title: meeting.title,
    description: meeting.description,
    dateTime: meeting.dateTime,
    joinEnabled: meeting.joinEnabled,

    // MAIN LOGIC
    meetingLink: meeting.joinEnabled ? meeting.meetingLink : null,
  }));

  return {
    success: true,
    meetings: formattedMeetings,
  };
};

export const getSingleMeeting = async (id: string, role: string, meetingId: string) => {
  const now = new Date();

  const meeting = await MeetingModel.findOne({
    _id: meetingId,
    dateTime: { $gte: now },
  })
  .populate("participants", "fullname email")
  .populate("projectId", "projectName")

  if(!meeting){
    throw tryError("Meeting not found", 404)
  }

  return meeting
};
