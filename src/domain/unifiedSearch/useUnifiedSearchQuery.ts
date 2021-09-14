import {
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";

import { SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID } from "../../constants";
import searchApolloClient from "../../client/searchApolloClient";
import useRouter from "../i18n/router/useRouter";
import useUnifiedSearch from "./useUnifiedSearch";

const appToUnifiedSearchLanguageMap = {
  fi: "FINNISH",
  sv: "SWEDISH",
  en: "ENGLISH",
};

const defaultPagination = {
  after: "",
  first: 10,
};

const FIXED_FILTERS = {
  ontologyTreeId: SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID,
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
export default function useUnifiedSearchQuery<TData = any>(
  query: DocumentNode | TypedDocumentNode<TData, UnifiedSearchVariables>,
  variables?: UnifiedSearchVariables,
  otherOptions?: Omit<
    QueryHookOptions<TData, UnifiedSearchVariables>,
    "variables"
  >
) {
  const {
    filters: { q, ...searchParams },
  } = useUnifiedSearch();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { fetchMore, ...delegated } = useQuery(query, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      language: appToUnifiedSearchLanguageMap[locale],
      ...FIXED_FILTERS,
      ...defaultPagination,
      // Default query; everything
      q: q?.join(" ") ?? "*",
      ...searchParams,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
    ...otherOptions,
  });

  const handleFetchMore = (variables: Partial<UnifiedSearchVariables>) =>
    fetchMore({
      variables: { ...variables },
    });

  return {
    fetchMore: fetchMore ? handleFetchMore : fetchMore,
    ...delegated,
  };
}
