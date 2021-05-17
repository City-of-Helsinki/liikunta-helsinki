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
        MediaItem: {
          fields: {
            mediaItemUrl: {
              // For some reason the GraphQL endpoint isn't able to return image
              // data.
              read() {
                // eslint-disable-next-line max-len
                return "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg";
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
