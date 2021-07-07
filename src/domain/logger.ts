/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import chalk, { Color } from "chalk";

import Config from "../config";

function getColor(level: string) {
  switch (level) {
    case "error":
      return chalk.bold.red;
    case "warning":
      return chalk.bold.yellow;
    case "debug":
      return chalk.cyan;
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

  if (process.env.NODE_ENV !== "production") {
    return [
      new Date(messageData.timestamp).toLocaleTimeString(),
      `${color(renderedTag)} -`,
      message,
    ].join(" ");
  }

  return messageData;
}

// Never log on the client side in production in order to avoid hurting the
// performance of the user's browser.
const isNotProductionClient = () =>
  !(process.browser && process.env.NODE_ENV === "production");

function createLogger(namespace: string) {
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
export const dataSourceLogger = createLogger("dataSource");
export const dataSourceHaukiLogger = createLogger("ds:Hauki");
export const dataSourceTprekLogger = createLogger("ds:Tprek");
export const staticGenerationLogger = createLogger("staticGeneration");
export const logger = createLogger("general");

export default createLogger;
