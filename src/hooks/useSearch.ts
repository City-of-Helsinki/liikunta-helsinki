import { useCallback } from "react";

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
  const [asPathWithoutSearch] = router.asPath.split("?");

  const getSearchRoute = useCallback(
    (search: Search) => {
      return `${asPathWithoutSearch}?${getQueryString(search)}`;
    },
    [asPathWithoutSearch]
  );

  const search = useCallback(
    (search: Search, type: "push" | "replace" = "push") => {
      const method = router[type];

      if (search === null) {
        return method(asPathWithoutSearch);
      }

      return method(getSearchRoute(search));
    },
    [getSearchRoute, router, asPathWithoutSearch]
  );

  return { search, getSearchRoute };
}

export default useSearch;
