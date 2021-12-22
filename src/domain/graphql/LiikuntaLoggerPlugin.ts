import { ApolloServerPlugin } from "apollo-server-plugin-base";

import { Context } from "../../types";
import { graphqlLogger as logger } from "../logger";
import ResolverMonitor from "./ResolverMonitor";

function getResolverName(
  operationName = "unnamed",
  variables: unknown = {},
  context: Context
) {
  const variablesAsString = Object.entries(variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join(",");
  const language = context.language;
  const contextAsString = language ? `[${language}]` : "";

  return `${operationName}(${variablesAsString})${contextAsString}`;
}

export default class LiikuntaLoggerPlugin implements ApolloServerPlugin {
  async requestDidStart({ request, context }) {
    const requestName = getResolverName(
      request.operationName,
      request.variables,
      context
    );
    const monitor = new ResolverMonitor(logger, requestName);

    logger.info(`Received request ${requestName}`);

    return {
      async didEncounterErrors({ errors }) {
        const errorsAsString = errors.map((error) => error?.toString());

        logger.error(
          `Error while resolving ${requestName}:\n\n${errorsAsString.join(
            "\n"
          )}\n`
        );
      },
      async willSendResponse() {
        monitor.end();
        logger.info(`Completed request ${requestName}`);
      },
    };
  }
}
