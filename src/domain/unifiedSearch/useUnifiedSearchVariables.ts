import {
  HELSINKI_OCD_DIVISION_ID,
  SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID,
} from "../../constants";
import { Coordinates } from "../../types";
import useGeolocation from "../../common/geolocation/useGeolocation";
import useRouter from "../i18n/router/useRouter";
import {
  SearchListQueryVariables,
  UnifiedSearchLanguage,
} from "./graphql/__generated__";
import useUnifiedSearch from "./useUnifiedSearch";
import {
  OrderByType,
  OrderDirType,
  orderDirToUnifiedSearchDistanceOrder,
  OrderBy,
  OrderDir,
} from "./unifiedSearchConstants";

function getOpenAt(openAt: Date, isOpenNow: boolean): string | null {
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

export type OverridableVariables = {
  first: number;
};

export default function useUnifiedSearchVariables(
  variables?: OverridableVariables
): SearchListQueryVariables {
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
      ontologyWordIds,
      after,
      first,
    },
  } = useUnifiedSearch();
  const geolocation = useGeolocation({
    skip: orderBy !== "distance",
  });
  const router = useRouter();

  const locale = router.locale ?? router.defaultLocale;

  return {
    language: appToUnifiedSearchLanguageMap[locale] as UnifiedSearchLanguage,
    // Default query; everything
    q: (q ?? ["*"]).join(" "),
    ontologyTreeIds: ontologyTreeIds?.map((treeId) => treeId.toString()),
    ontologyWordIds: ontologyWordIds?.map((wordId) => wordId.toString()),
    administrativeDivisionIds,
    openAt: getOpenAt(openAt, isOpenNow),
    ...getOrderBy(orderBy, orderDir, { position: geolocation.coordinates }),
    after: after ?? defaultPagination.after,
    first: variables?.first ?? first ?? defaultPagination.first,
  };
}
