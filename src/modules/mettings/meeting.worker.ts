import { Worker } from "bullmq";

const worker = new Worker(
  "meetingQueue",
  async (job) => {
    console.log("🔥 Job received:", job.name);

    if (job.name === "testJob") {
      console.log("Message:", job.data.message);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);