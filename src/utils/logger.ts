import { Request, Response } from "express";
import morgan from "morgan";
import chalk from "chalk";

export const requestLogger = morgan((tokens, req: Request, res: Response) => {
  const status = Number(tokens.status(req, res));
  
  const statusColor = 
    status >= 500 ? chalk.red.bold 
    : status >= 400 ? chalk.yellow.bold 
    : chalk.green.bold;

  const method = tokens.method(req, res) || "UNKNOWN";
  const methodColor = 
    method === "GET" ? chalk.blue.bold 
    : method === "POST" ? chalk.magenta.bold 
    : chalk.red.bold;

  return [
    chalk.gray("➜"),
    methodColor(method.padEnd(7)),
    chalk.white(tokens.url(req, res)),
    statusColor(`[${status}]`),
    chalk.gray(`${tokens['response-time'](req, res)}ms`),
    chalk.gray(`@ ${new Date().toLocaleTimeString()}`)
  ].join(" ");
});