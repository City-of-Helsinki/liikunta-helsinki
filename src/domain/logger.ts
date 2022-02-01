/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk from "chalk";

import Config from "../config";

type LoggerFunction = (message?: any, ...optionalParameters: any[]) => void;

export type Logger = {
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
};

function getColor(level: string) {
  switch (level) {
    case "error":
      return chalk.bold.red;
    case "warn":
      return chalk.bold.yellow;
    case "debug":
      return chalk.cyan;
    case "info":
      return chalk.bold.white;
    default:
      return chalk.white;
  }
}

function formatMessage(
  namespace: string,
  level: string,
  message?: any,
  ...optionalParameters: any[]
) {
  const color = getColor(level);
  const tags = [level, namespace];
  const renderedTag = tags.map((tag) => `[${tag}]`).join(" ");
  const messageData = {
    level,
    timestamp: new Date().toJSON(),
    message: [`${renderedTag} - `, message, ...optionalParameters].join(" "),
  };

  return [
    new Date(messageData.timestamp).toLocaleTimeString(),
    `${color(renderedTag)} -`,
    message,
  ].join(" ");
}

// Never log on the client side in production in order to avoid hurting the
// performance of the user's browser.
const isNotProductionClient = () =>
  !(process.browser && process.env.NODE_ENV === "production");

function createLogger(namespace: string): Logger {
  return {
    debug: (message?: any, ...optionalParameters: any[]) =>
      isNotProductionClient() &&
      Config.debug &&
      console.debug(
        formatMessage(namespace, "debug", message, ...optionalParameters)
      ),
    info: (message?: any, ...optionalParameters: any[]) =>
      isNotProductionClient() &&
      console.info(
        formatMessage(namespace, "info", message, ...optionalParameters)
      ),
    warn: (message?: any, ...optionalParameters: any[]) =>
      isNotProductionClient() &&
      console.warn(
        formatMessage(namespace, "warn", message, ...optionalParameters)
      ),
    error: (message?: any, ...optionalParameters: any[]) =>
      isNotProductionClient() &&
      console.error(
        formatMessage(namespace, "error", message, ...optionalParameters)
      ),
  };
}

export const graphqlLogger = createLogger("graphql");
export const graphqlClientLogger = createLogger("graphql-client");
export const dataSourceLogger = createLogger("dataSource");
export const dataSourceHaukiLogger = createLogger("ds:Hauki");
export const dataSourceTprekLogger = createLogger("ds:Tprek");
export const dataSourceLinkedLogger = createLogger("ds:linked");
export const staticGenerationLogger = createLogger("staticGeneration");
export const logger = createLogger("general");
export const networkLogger = createLogger("network");

export default createLogger;
