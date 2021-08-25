import { useCallback } from "react";

import i18nRoutes from "../../../i18nRoutes.config";
import queryPersister from "../../util/queryPersister";
import useRouter from "../i18n/router/useRouter";
import { UnifiedSearchParameters } from "./types";

type TransitionOptions = {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
};

type Config = {
  searchRoute?: "/search" | "/search/map";
};

export default function useSetUnifiedSearchParams(config?: Config) {
  const searchRoute = config?.searchRoute ?? "/search";
  const router = useRouter();
  const searchBasePath =
    i18nRoutes[searchRoute].find(({ locale }) => locale === router.locale)
      ?.source ?? searchRoute;

  const getSearchRoute = useCallback(
    (search: UnifiedSearchParameters) => {
      const stringValueSearch = Object.entries(search).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: typeof value === "number" ? value.toString() : value,
        }),
        {}
      );
      const queryString = new URLSearchParams(stringValueSearch).toString();

      return `${searchBasePath}${queryString ? `?${queryString}` : ""}`;
    },
    [searchBasePath]
  );

  const setUnifiedSearchParams = useCallback(
    (
      search: UnifiedSearchParameters,
      type: "push" | "replace" = "push",
      options?: TransitionOptions
    ) => {
      queryPersister.persistQuery(search);

      const method = router[type];

      if (search === null) {
        return method(searchBasePath, undefined, options);
      }

      return method(getSearchRoute(search), undefined, options);
    },
    [getSearchRoute, router, searchBasePath]
  );

  return { setUnifiedSearchParams, getSearchRoute };
}
