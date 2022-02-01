import {
  InMemoryCache,
  NormalizedCacheObject,
  ApolloClient,
} from "@apollo/client";
import { useMemo } from "react";

import AppConfig from "../../domain/app/AppConfig";
import {
  initializeApolloClient,
  MutableReference,
} from "../../common/apollo/utils";
import { sortMenuItems } from "../../common/apollo/utils";

const cmsApolloClient = new MutableReference<
  ApolloClient<NormalizedCacheObject>
>();

export function createCmsApolloClient() {
  return new ApolloClient({
    ssrMode: !process.browser,
    uri: AppConfig.cmsGraphqlEndpoint,
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
  return initializeApolloClient<
    NormalizedCacheObject,
    ApolloClient<NormalizedCacheObject>
  >({
    initialState,
    mutableCachedClient: cmsApolloClient,
    createClient: createCmsApolloClient,
  });
}

export function useCmsApollo(initialState) {
  const store = useMemo(
    () => initializeCmsApollo(initialState),
    [initialState]
  );

  return store;
}
