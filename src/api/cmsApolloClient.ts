import { InMemoryCache } from "@apollo/client";
import { useMemo } from "react";

import Config from "../config";
import LiikuntaApolloClient from "./LiikuntaApolloClient";
import { sortMenuItems } from "./utils";

let cmsApolloClient: LiikuntaApolloClient;

function createCmsApolloClient() {
  return new LiikuntaApolloClient({
    uri: Config.cmsGraphqlEndpoint,
    cache: new InMemoryCache({
      typePolicies: {
        MenuItems: {
          fields: {
            nodes: {
              read(nodes) {
                return sortMenuItems(nodes);
              },
            },
          },
        },
      },
    }),
  });
}

// https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
export default function initializeCmsApollo(initialState = null) {
  const _apolloClient = cmsApolloClient ?? createCmsApolloClient();

  // Initial state hydration
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") {
    return _apolloClient;
  }

  // Create the Apollo Client once in the client
  if (!cmsApolloClient) {
    cmsApolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function useCmsApollo(initialState) {
  const store = useMemo(() => initializeCmsApollo(initialState), [
    initialState,
  ]);

  return store;
}
