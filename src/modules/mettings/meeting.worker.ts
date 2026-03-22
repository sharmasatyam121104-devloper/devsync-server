import { Worker } from "bullmq";
import { redisConfig } from "../../config/redis";
import { handleMeetingReminder } from "./meeting.handler";

const worker = new Worker(
  "meetingQueue",
  async (job) => {
    switch (job.name) {
      case "meetingReminder":
        await handleMeetingReminder(job.data.meetingId);
        break;
    }
  },
  {
    connection: redisConfig,
  }
);

export default worker;