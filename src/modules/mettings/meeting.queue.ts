import { Queue } from "bullmq";
import { redisConfig } from "../../config/redis";

export const meetingQueue = new Queue("meetingQueue", {
  connection: redisConfig,
});