import {
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";

import {
  HELSINKI_OCD_DIVISION_ID,
  SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID,
} from "../../constants";
import { Coordinates } from "../../types";
import useGeolocation from "../../common/geolocation/useGeolocation";
import searchApolloClient from "../unifiedSearch/searchApolloClient";
import useRouter from "../i18n/router/useRouter";
import useUnifiedSearch from "./useUnifiedSearch";
import {
  OrderByType,
  OrderDirType,
  orderDirToUnifiedSearchDistanceOrder,
  UnifiedSearchOrderBy,
  OrderBy,
  OrderDir,
} from "./unifiedSearchConstants";

function getOpenAt(openAt: Date, isOpenNow: boolean) {
  if (openAt) {
    return openAt.toJSON();
  }

  if (isOpenNow) {
    return "now";
  }

  return null;
}

type OrderByOptions = {
  position: Coordinates | undefined;
};

function getOrderBy(
  orderBy: OrderByType,
  orderDir: OrderDirType,
  options?: OrderByOptions
) {
  const usOrderDir = orderDirToUnifiedSearchDistanceOrder[orderDir];

  if (orderBy === OrderBy.distance && options.position) {
    return {
      orderByDistance: {
        latitude: options.position.latitude,
        longitude: options.position.longitude,
        order: usOrderDir,
      },
    };
  }

  if (orderBy === OrderBy.name) {
    return {
      orderByName: {
        order: usOrderDir,
      },
    };
  }

  // With no ordering, Unified Search will return the default sort order of
  // ElasticSearch, which is by relevance.
  return {};
}

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
  orderByDistance?: {
    latitude: number;
    longitude: number;
    order?: UnifiedSearchOrderBy;
  };
  orderByName?: {
    order?: UnifiedSearchOrderBy;
  };
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
      // Limit results inside Helsinki when there is no administrative division(s) selected
      administrativeDivisionIds = [HELSINKI_OCD_DIVISION_ID],
      isOpenNow,
      openAt,
      orderBy = OrderBy.name,
      orderDir = OrderDir.asc,
      ...searchParams
    },
  } = useUnifiedSearch();
  const geolocation = useGeolocation({
    skip: orderBy !== "distance",
  });
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
      administrativeDivisionIds,
      openAt: getOpenAt(openAt, isOpenNow),
      ...getOrderBy(orderBy, orderDir, { position: geolocation.coordinates }),
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
