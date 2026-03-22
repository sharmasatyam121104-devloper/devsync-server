import MeetingModel from "./meeting.model";
import UserModel from "../user/user.model";
import sendMail from "../../utils/sendEmail";
import { meetingReminderTemplate } from "../../templates/meetingEmail.template";

export const handleMeetingReminder = async (meetingId: string) => {
  const meeting = await MeetingModel.findById(meetingId);
  if (!meeting) return;

  meeting.joinEnabled = true;
  await meeting.save();

  const users = await UserModel.find(
    { _id: { $in: meeting.participants } },
    { email: 1 }
  );

  await Promise.all(
    users.map((user) =>
      sendMail(
        user.email,
        "Meeting Reminder",
        meetingReminderTemplate(
            meeting.title,
            meeting.meetingLink,
            meeting.dateTime
        )
      )
    )
  );
};