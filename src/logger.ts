/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Config from "./config";

function formatMessage(
  namespace: string,
  level: string,
  message?: any,
  ...optionalParameters: any[]
) {
  const messageData = {
    level,
    timestamp: new Date().toJSON(),
    message: [`${namespace}:`, message, ...optionalParameters].join(" "),
  };

  if (process.env.NODE_ENV !== "production") {
    return [
      messageData.timestamp,
      `${messageData.level} -`,
      messageData.message,
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
export const dataSourceHaukiLogger = createLogger("dataSource:Hauki");
export const staticGenerationLogger = createLogger("staticGeneration");
export const misc = createLogger("misc");

export default createLogger;
