import { Worker } from "bullmq";
import { redisConfig } from "../../../config/redis";
import { handleOtp } from "./otp.handler";

console.log("🔥 OTP Worker FILE LOADED");

const worker = new Worker(
  "otpQueue",
  async (job) => {
    console.log("Job received:", job.name, job.data);

    if (job.name === "sendOtp") {
      await handleOtp(job.data.email, job.data.otp);
    }
  },
  {
    connection: redisConfig,
  }
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Job failed:", err);
});