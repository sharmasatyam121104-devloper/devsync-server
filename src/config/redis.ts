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

export const redisConfig = (() => {
  try {
    const { REDIS_HOST, REDIS_PORT } = process.env;

    if (!REDIS_HOST) throw new Error("REDIS_HOST is missing");
    if (!REDIS_PORT) throw new Error("REDIS_PORT is missing");

    const port = Number(REDIS_PORT);

    if (!Number.isInteger(port)) {
      throw new Error("REDIS_PORT must be an integer");
    }

    if (port < 1 || port > 65535) {
      throw new Error("REDIS_PORT must be between 1 and 65535");
    }

    log.success(`Redis Config Loaded → ${REDIS_HOST}:${port}`);

    return { host: REDIS_HOST, port };
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }
    process.exit(1);
  }
})();

const redisClient = createClient({
  // url: `redis://${redisConfig.host}:${redisConfig.port}`,
  url:process.env.REDIS_URL,
});

//  Better logging
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
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to connect Redis: ${error.message}`);
    }
    // process.exit(1);

    log.info("Running app without Redis...");
  }
};

export default redisClient;