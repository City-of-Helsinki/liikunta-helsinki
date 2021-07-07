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
import { logger } from "../domain/logger";
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
  return initializeApolloClient(
    initialState,
    apiApolloClient,
    createNextApiApolloClient
  );
}

export function useNextApiApolloClient(initialState) {
  const store = useMemo(() => initializeNextApiApolloClient(initialState), [
    initialState,
  ]);

  return store;
}
