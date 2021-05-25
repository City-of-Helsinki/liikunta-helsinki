import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
} from "@apollo/client";

import Config from "../config";

const cache: InMemoryCache = new InMemoryCache({});

const searchApolloClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    cache,
    uri: Config.unifiedSearchGraphqlEndpoint,
    ssrMode: false,
  }
);

export default searchApolloClient;
