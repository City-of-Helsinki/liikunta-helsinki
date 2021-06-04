import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import Config from "../config";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        unifiedSearch: relayStylePagination(),
      },
    },
  },
});

const searchApolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    cache,
    uri: Config.unifiedSearchGraphqlEndpoint,
    ssrMode: false,
  }
);

export default searchApolloClient;
