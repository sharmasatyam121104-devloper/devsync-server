import { Queue } from "bullmq";
import { redisConfig } from "../../../config/redis";

export const otpQueue = new Queue("otpQueue", {
  connection: redisConfig,
});