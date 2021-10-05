import {
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";

import { SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID } from "../../constants";
import searchApolloClient from "../unifiedSearch/searchApolloClient";
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

type UnifiedSearchVariables = {
  q?: string;
  language?: typeof appToUnifiedSearchLanguageMap[keyof typeof appToUnifiedSearchLanguageMap];
  ontologyTreeIds?: number[];
  administrativeDivisionIds?: string[];
  openAt?: string;
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
    filters: {
      q,
      // By default filter by the sports dept. ontology tree id
      ontologyTreeIds = [SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID],
      isOpenNow,
      ...searchParams
    },
  } = useUnifiedSearch();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { fetchMore, ...delegated } = useQuery(query, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      language: appToUnifiedSearchLanguageMap[locale],
      ...defaultPagination,
      // Default query; everything
      q: q?.join(" ") ?? "*",
      ontologyTreeIds,
      openAt: isOpenNow ? "now" : null,
      ...searchParams,
      ...variables,
    },
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
