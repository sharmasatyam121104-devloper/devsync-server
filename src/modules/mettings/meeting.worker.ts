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

worker.on("completed", (job) => {
  console.log("Job completed in meetingQueue:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Job failed in meetingQueue:", err);
});

export default worker;