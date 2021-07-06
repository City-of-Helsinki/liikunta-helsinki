import { useRouter } from "next/router";
import { useCallback } from "react";

type Filters = {
  q: string;
  ontology?: string;
};

type Search = string | Partial<Filters> | URLSearchParams;

const searchRouteMap = {
  fi: "/haku",
  sv: "/sok",
  en: "/search",
};

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

  const getSearchRoute = useCallback(
    (search: Search) => {
      const searchRoute = searchRouteMap[router.locale ?? router.defaultLocale];

      return `${searchRoute}?${getQueryString(search)}`;
    },
    [router.defaultLocale, router.locale]
  );

  const search = useCallback(
    (search: Search, type: "push" | "replace" = "push") => {
      const method = router[type];

      return method(getSearchRoute(search));
    },
    [getSearchRoute, router]
  );

  return { search, getSearchRoute };
}

export default useSearch;
