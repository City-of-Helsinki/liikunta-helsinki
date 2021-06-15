import https from "https";

import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
  HttpOptions,
} from "@apollo/client";
import { useMemo } from "react";

import Config from "../config";
import { misc as logger } from "../logger";
import initializeApolloClient from "./initializeApolloClient";

let apiApolloClient: ApolloClient<NormalizedCacheObject>;

function getHttpLink(uri: string) {
  let options: HttpOptions = {
    uri,
  };

  // Our review environment can't provide a valid certificate. Hence we allow
  // the application to be configured so that unauthorized requests are not
  // rejected. This allows us to test API changes in the review environment.
  if (Config.allowUnauthorizedRequests && new URL(uri).protocol === "https:") {
    logger.info("Allowing unauthorized requests");
    options = {
      ...options,
      fetchOptions: {
        agent: new https.Agent({ rejectUnauthorized: false }),
      },
    };
  }

  return new HttpLink(options);
}

function createNextApiApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache({}),
    link: getHttpLink(Config.nextApiGraphqlEndpoint),
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
