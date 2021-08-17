import { useRouter as useNextRouter } from "next/router";

import { getI18nPath, stringifyUrlObject } from "./utils";

export default function useRouter() {
  const { asPath, ...router } = useNextRouter();

  return {
    ...router,
    asPath:
      stringifyUrlObject({
        pathname: getI18nPath(router.route, router.locale),
        query: router.query,
      }) ?? asPath,
  };
}
