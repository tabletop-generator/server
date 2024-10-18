import pino from "pino";

interface LoggerOptions {
  level: string;
  transport?: {
    target: string;
    options: {
      colorize: boolean;
    };
  };
}

// Use `info` as our standard log level if not specified
const options: LoggerOptions = { level: process.env.LOG_LEVEL || "info" };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === "debug") {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
export default pino(options);
