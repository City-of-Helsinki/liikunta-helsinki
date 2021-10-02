import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  from,
  HttpLink,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

import Config from "../../config";
import apolloErrorLink from "../../common/apollo/apolloErrorLink";
import { excludeArgs } from "../../common/apollo/utils";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        unifiedSearch: relayStylePagination(excludeArgs(["after"])),
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
