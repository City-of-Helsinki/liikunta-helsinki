import { InMemoryCache } from "@apollo/client";
import { useMemo } from "react";

import Config from "../config";
import initializeApolloClient from "./initializeApolloClient";
import LiikuntaApolloClient from "./LiikuntaApolloClient";
import { sortMenuItems } from "./utils";

let cmsApolloClient: LiikuntaApolloClient;

function createCmsApolloClient() {
  return new LiikuntaApolloClient({
    ssrMode: !process.browser,
    uri: Config.cmsGraphqlEndpoint,
    cache: new InMemoryCache({
      typePolicies: {
        RootQuery: {
          queryType: true,
        },
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

export default function initializeCmsApollo(initialState = null) {
  const client = initializeApolloClient(
    initialState,
    cmsApolloClient,
    createCmsApolloClient
  );

  // Create the Apollo Client once in the client
  if (!cmsApolloClient) {
    cmsApolloClient = client;
  }

  return client;
}

export function useCmsApollo(initialState) {
  const store = useMemo(() => initializeCmsApollo(initialState), [
    initialState,
  ]);

  return store;
}
