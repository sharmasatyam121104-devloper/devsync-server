import chalk from "chalk";
import { createClient } from "redis";

const isDev = process.env.NODE_ENV === "development";

const log = {
  error: (msg: string) =>
    isDev
      ? console.error(chalk.bgRed.white.bold(" ERROR "), chalk.red(msg))
      : console.error(msg),

  success: (msg: string) =>
    isDev
      ? console.log(chalk.bgGreen.white.bold(" SUCCESS "), chalk.green(msg))
      : console.log(msg),

  info: (msg: string) =>
    isDev
      ? console.log(chalk.bgBlue.white.bold(" INFO "), chalk.blue(msg))
      : console.log(msg),
};

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  log.error("REDIS_URL is missing");
  process.exit(1);
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  log.error(`Redis Error: ${err.message}`);
});

redisClient.on("reconnecting", () => {
  log.info("Redis reconnecting...");
});

redisClient.on("ready", () => {
  log.success("Redis Connected");
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    log.success("Redis Connected Successfully");
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to connect Redis: ${error.message}`);
    }
    log.info("Running app without Redis...");
  }
};

if (!redisUrl) {
  log.error("REDIS_URL is missing");
  process.exit(1);
}

export const redisConfig = {
  url: redisUrl,
};

export default redisClient;