import { captureException } from "@sentry/nextjs";
import { ApolloError } from "apollo-server-micro";
import { GraphQLResolveInfo } from "graphql";

import { Context } from "../../types";

type ResolverFunction<T = unknown> = (
  source: unknown,
  args: unknown,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<T>;

type OnErrorFunction<E = unknown> = (error: E) => void;

const createQueryResolver =
  (resolver: ResolverFunction, onError?: OnErrorFunction) =>
  async (
    source: unknown,
    args: unknown,
    context: Context,
    info: GraphQLResolveInfo
  ) => {
    try {
      const resolverResult = await resolver(source, args, context, info);

      return resolverResult;
    } catch (e) {
      // Sentry logging
      captureException(e);

      if (onError) {
        onError(e);
      }
      if (e instanceof ApolloError) {
        throw e;
      }

      if (process.env.NODE_ENV === "development") {
        throw e;
      } else {
        // Hide any unexpected errors in order to avoid accidentally leaking too
        // much information when in production.
        throw new ApolloError("Internal server error");
      }
    }
  };

export default createQueryResolver;
