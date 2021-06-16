import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";

import Config from "../config";
import initializeApolloClient from "./initializeApolloClient";

let apiApolloClient: ApolloClient<NormalizedCacheObject>;

function createNextApiApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache({}),
    uri: Config.nextApiGraphqlEndpoint,
    ssrMode: !process.browser,
  });
}

export default function initializeNextApiApolloClient(initialState = null) {
  const client = initializeApolloClient(
    initialState,
    apiApolloClient,
    createNextApiApolloClient
  );

  // Create the Apollo Client once in the client
  if (!apiApolloClient) {
    apiApolloClient = client;
  }

  return client;
}

export function useNextApiApolloClient(initialState) {
  const store = useMemo(() => initializeNextApiApolloClient(initialState), [
    initialState,
  ]);

  return store;
}
