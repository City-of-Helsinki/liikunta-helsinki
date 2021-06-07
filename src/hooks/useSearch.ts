import { useRouter } from "next/router";
import { useCallback } from "react";

const searchRouteMap = {
  fi: "/haku",
  sv: "/sok",
  en: "/search",
};

function getQueryString(
  search: string | Record<string, string> | URLSearchParams
): string {
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

  const search = useCallback(
    (
      search: string | Record<string, string> | URLSearchParams,
      type: "push" | "replace" = "push"
    ) => {
      const searchRoute = searchRouteMap[router.locale ?? router.defaultLocale];
      const method = router[type];
      const queryString = getQueryString(search);

      return method(`${searchRoute}?${queryString}`);
    },
    [router]
  );

  return search;
}

export default useSearch;
