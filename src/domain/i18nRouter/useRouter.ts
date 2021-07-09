import { useRouter as useNextRouter } from "next/router";

import { getI18nAsPath } from "./utils";

export default function useRouter() {
  const { asPath, ...router } = useNextRouter();

  return {
    ...router,
    asPath: getI18nAsPath(router.route, router.locale) ?? asPath,
  };
}
