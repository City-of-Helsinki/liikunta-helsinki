import { onError } from "@apollo/client/link/error";
import Router from "next/router";

import { graphqlClientLogger, networkLogger } from "../../domain/logger";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      graphqlClientLogger.error(
        `Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    Router.push("/error");
    networkLogger.error(networkError);
  }
});

export default errorLink;
