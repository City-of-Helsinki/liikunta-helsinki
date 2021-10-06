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
import capitalize from "../../common/utils/capitalize";

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        unifiedSearch: relayStylePagination(excludeArgs(["after"])),
      },
    },
    OntologyWord: {
      fields: {
        label: {
          read(label: LanguageString) {
            const { fi, en, sv } = label;
            return {
              ...label,
              fi: capitalize(fi),
              en: capitalize(en),
              sv: capitalize(sv),
            };
          },
        },
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

type LanguageString = {
  fi: string;
  en: string;
  sv: string;
};
