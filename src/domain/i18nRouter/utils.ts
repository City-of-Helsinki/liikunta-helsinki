import i18nRoutes from "../../../i18nRoutes.config";

export function getI18nAsPath(route: string, locale: string): string | null {
  const hasI18nRewriteRule = Object.keys(i18nRoutes).includes(route);

  if (!hasI18nRewriteRule) {
    return null;
  }

  const i18nRewriteRuleForCurrentLocale = i18nRoutes[route].find(
    (rewriteRule) => rewriteRule.locale === locale
  );

  if (!i18nRewriteRuleForCurrentLocale) {
    return null;
  }

  return i18nRewriteRuleForCurrentLocale.source;
}
