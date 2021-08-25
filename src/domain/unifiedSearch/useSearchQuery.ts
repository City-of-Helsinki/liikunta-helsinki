import {
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";

import searchApolloClient from "../../client/searchApolloClient";
import useRouter from "../../domain/i18n/router/useRouter";
import useSearchParameters from "../../domain/unifiedSearch/useSearchParameters";

const appToUnifiedSearchLanguageMap = {
  fi: "FINNISH",
  sv: "SWEDISH",
  en: "ENGLISH",
};

type UnifiedSearchVariables = {
  q?: string;
  language?: typeof appToUnifiedSearchLanguageMap[keyof typeof appToUnifiedSearchLanguageMap];
  ontologyTreeId?: number;
  administrativeDivisionId?: string;
  first?: number;
  after?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useSearchQuery<TData = any>(
  query: DocumentNode | TypedDocumentNode<TData, UnifiedSearchVariables>,
  variables?: UnifiedSearchVariables,
  otherOptions?: Omit<
    QueryHookOptions<TData, UnifiedSearchVariables>,
    "variables"
  >
) {
  const {
    q = "*",
    administrativeDivisionId,
    ontologyTreeId,
  } = useSearchParameters();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { fetchMore, ...delegated } = useQuery(query, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      q,
      language: appToUnifiedSearchLanguageMap[locale],
      ontologyTreeId,
      administrativeDivisionId,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
    ...otherOptions,
  });

  const handleFetchMore = (variables: Partial<UnifiedSearchVariables>) =>
    fetchMore({
      variables: { q, administrativeDivisionId, ontologyTreeId, ...variables },
    });

  return {
    fetchMore: fetchMore ? handleFetchMore : fetchMore,
    ...delegated,
  };
}
