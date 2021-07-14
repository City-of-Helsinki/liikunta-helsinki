import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  from,
  HttpLink,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import Config from "../config";
import apolloErrorLink from "./apolloErrorLink";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        unifiedSearch: relayStylePagination(),
      },
    },
  },
});

const httpLink = new HttpLink({
  uri: Config.unifiedSearchGraphqlEndpoint,
});

const searchApolloClient: ApolloClient<NormalizedCacheObject> =
  new ApolloClient({
    cache,
    link: from([apolloErrorLink, httpLink]),
    ssrMode: false,
  });

export default searchApolloClient;
