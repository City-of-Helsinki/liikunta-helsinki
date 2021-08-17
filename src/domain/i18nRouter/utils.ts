import { UrlObject } from "url";

import i18nRoutes from "../../../i18nRoutes.config";

// dynamic path: /venues/:id
// segmented: /venues/[id]
function transformDynamicPathIntoSegmentedDynamicPath(path: string): string {
  return path
    .split("/")
    .map((part) => (part.startsWith(":") ? `[${part.slice(1)}]` : part))
    .join("/");
}

export function getI18nPath(route: string, locale: string): string {
  // English is the default language within code so it doesn't need transforming
  if (locale === "en") {
    return route;
  }

  const i18nRewriteRules =
    Object.entries(i18nRoutes).find(
      ([routeKey]) =>
        transformDynamicPathIntoSegmentedDynamicPath(routeKey) === route
    )?.[1] ?? [];

  if (!i18nRewriteRules || i18nRewriteRules.length === 0) {
    return null;
  }

  const i18nRewriteRuleForCurrentLocale = i18nRewriteRules.find(
    (rewriteRule) => rewriteRule.locale === locale
  );

  if (!i18nRewriteRuleForCurrentLocale) {
    return null;
  }

  return transformDynamicPathIntoSegmentedDynamicPath(
    i18nRewriteRuleForCurrentLocale.source
  );
}

const isDynamic = (part: string) => part.startsWith("[") && part.endsWith("]");
const parseDynamicName = (part: string) => part.slice(1, -1);

export function stringifyUrlObject(url: UrlObject): string {
  const pathname = url.pathname
    ?.split("/")
    .map((part) =>
      isDynamic(part) ? url.query[parseDynamicName(part)] ?? part : part
    )
    .join("/");

  return `${pathname}${url.search || ""}`;
}
