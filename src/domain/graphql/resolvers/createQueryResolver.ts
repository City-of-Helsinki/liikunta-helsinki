import { ApolloError } from "apollo-server-micro";
import { GraphQLResolveInfo } from "graphql";

import { Context } from "../../../types";
import { graphqlLogger as logger } from "../../logger";
import ResolverMonitor from "../utils/ResolverMonitor";

function getResolverName(
  _: unknown,
  args: unknown,
  context: Context,
  info: GraphQLResolveInfo
) {
  const argsAsString = Object.entries(args)
    .map(([key, value]) => `${key}: ${value}`)
    .join(",");
  const language = context.language;
  const contextAsString = language ? `[${language}]` : "";

  return `${info.path.key}${info.path.typename}(${argsAsString})${contextAsString}`;
}

type ResolverFunction<T = unknown> = (
  source: unknown,
  args: unknown,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<T>;

type OnErrorFunction<E = unknown> = (error: E) => void;

const createQueryResolver = (
  resolver: ResolverFunction,
  onError?: OnErrorFunction
) => async (
  source: unknown,
  args: unknown,
  context: Context,
  info: GraphQLResolveInfo
) => {
  const resolverName = getResolverName(source, args, context, info);
  const monitor = new ResolverMonitor(logger, resolverName);

  logger.info(`Trying to resolve ${resolverName}`);

  try {
    const resolverResult = await resolver(source, args, context, info);

    monitor.end();
    logger.info(`Resolved ${resolverName}`);

    return resolverResult;
  } catch (e) {
    logger.info(`Error while resolving ${resolverName}:\n\n${e}\n`);

    if (onError) {
      onError(e);
    }

    if (e instanceof ApolloError) {
      throw e;
    }

    // Hide any unexpected errors in order to avoid accidentally leaking too
    // much information.
    throw new ApolloError("Internal server error");
  }
};

export default createQueryResolver;
