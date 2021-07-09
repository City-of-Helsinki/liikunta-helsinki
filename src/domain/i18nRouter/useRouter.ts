import { useRouter as useNextRouter } from "next/router";

import { getI18nPath } from "./utils";

export default function useRouter() {
  const { asPath, ...router } = useNextRouter();

  return {
    ...router,
    asPath: getI18nPath(router.route, router.locale) ?? asPath,
  };
}
