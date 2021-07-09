import { useCallback } from "react";

import i18nRoutes from "../../i18nRoutes.config";
import useRouter from "../domain/i18nRouter/useRouter";

type Filters = {
  q: string;
  ontology?: string;
};

type Search = string | Partial<Filters> | URLSearchParams | null;

function getQueryString(search: Search): string {
  if (typeof search === "string") {
    return search;
  }

  if (search instanceof URLSearchParams) {
    return search.toString();
  }

  return new URLSearchParams(search).toString();
}

function useSearch() {
  const router = useRouter();
  const searchBasePath =
    i18nRoutes["/search"].find(({ locale }) => locale === router.locale)
      ?.source ?? "/search";

  const getSearchRoute = useCallback(
    (search: Search) => {
      return `${searchBasePath}?${getQueryString(search)}`;
    },
    [searchBasePath]
  );

  const search = useCallback(
    (search: Search, type: "push" | "replace" = "push") => {
      const method = router[type];

      if (search === null) {
        return method(searchBasePath);
      }

      return method(getSearchRoute(search));
    },
    [getSearchRoute, router, searchBasePath]
  );

  return { search, getSearchRoute };
}

export default useSearch;
