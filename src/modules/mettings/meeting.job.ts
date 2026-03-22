import { meetingQueue } from "./meeting.queue";

export const addMeetingReminderJob = async ( meetingId: string, dateTime: string ) => {
  const delay = new Date(dateTime).getTime() - Date.now() - 5 * 60 * 1000;

  await meetingQueue.add(
    "meetingReminder",
    { meetingId },
    {
      delay: delay > 0 ? delay : 0,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};