import { useRouter as useNextRouter } from "next/router";

import { getI18nPath, stringifyUrlObject } from "./utils";

export default function useRouter() {
  const { asPath, ...router } = useNextRouter();
  const search = asPath.split("?")[1];

  return {
    ...router,
    asPath:
      stringifyUrlObject({
        pathname: getI18nPath(router.route, router.locale),
        query: router.query,
        search: search ? `?${search}` : null,
      }) ?? asPath,
  };
}
