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
