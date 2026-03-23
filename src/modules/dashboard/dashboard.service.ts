import { IssueModel } from "../issue/issue.model";
import MeetingModel from "../mettings/meeting.model";
import ProjectModel from "../project/project.model";

export const getDashboardData = async (userId: string, role: string) => {
  const now = new Date();

  // 🔥 Parallel execution (FAST)
  const [
    totalProjects,
    activeProjects,
    assignedIssues,
    upcomingMeetings,
    recentProjects,
    recentMeetings,
    recentIssues,
  ] = await Promise.all([
    // Counts
    ProjectModel.countDocuments({
      "members.userId": userId,
    }),

    ProjectModel.countDocuments({
      "members.userId": userId,
      status: "ACTIVE",
    }),

    IssueModel.countDocuments({
      assignedTo: userId,
    }),

    MeetingModel.countDocuments({
      participants: userId,
      dateTime: { $gte: now },
    }),

    // 🔥 Recent Projects (last 3)
    ProjectModel.find({
      "members.userId": userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("projectName status createdAt"),

    // 🔥 Upcoming Meetings (next 3)
    MeetingModel.find({
      participants: userId,
      dateTime: { $gte: now },
    })
      .sort({ dateTime: 1 })
      .limit(3)
      .select("title dateTime joinEnabled"),

    // 🔥 Recent Issues (last 3)
    IssueModel.find({
      assignedTo: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title status priority createdAt"),
  ]);

  // 🔥 Simple Activity Generator
  const recentActivities = [
    ...recentProjects.map((p) => ({
      message: `Project "${p.projectName}" created`,
      time: p.createdAt,
    })),

    ...recentMeetings.map((m) => ({
      message: `Meeting "${m.title}" scheduled`,
      time: m.dateTime,
    })),

    ...recentIssues.map((i) => ({
      message: `Issue "${i.title}" assigned`,
      time: i.createdAt,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
   .slice(0, 5); // only latest 5

  return {
    success: true,
    data: {
      // 🔹 Stats
      totalProjects,
      activeProjects,
      assignedIssues,
      upcomingMeetings,

      // 🔹 Lists
      recentProjects,
      recentMeetings,
      recentActivities,
    },
  };
};