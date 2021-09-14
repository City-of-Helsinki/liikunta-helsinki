import { onError } from "@apollo/client/link/error";

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
    networkLogger.error(networkError);
  }
});

export default errorLink;
