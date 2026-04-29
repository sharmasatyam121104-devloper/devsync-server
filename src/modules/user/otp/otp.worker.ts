import { Worker } from "bullmq";
import { redisConfig } from "../../../config/redis";
import { handleOtp } from "./otp.handler";

new Worker(
  "otpQueue",
  async (job) => {
    if (job.name === "sendOtp") {
      await handleOtp(job.data.email, job.data.otp);
    }
  },
  {
    connection: redisConfig,
  }
);