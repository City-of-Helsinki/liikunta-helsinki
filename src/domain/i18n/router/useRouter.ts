import { useRouter as useNextRouter } from "next/router";

import { Locale } from "../../../config";
import { getI18nPath, stringifyUrlObject } from "./utils";

export default function useRouter() {
  const { asPath, locale, defaultLocale, ...router } = useNextRouter();
  const search = asPath.split("?")[1];

  return {
    ...router,
    defaultLocale: defaultLocale as Locale,
    locale: locale as Locale,
    asPath:
      stringifyUrlObject({
        pathname: getI18nPath(router.route, locale),
        query: router.query,
        search: search ? `?${search}` : null,
      }) ?? asPath,
  };
}
