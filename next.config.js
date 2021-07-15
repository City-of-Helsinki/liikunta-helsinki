/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const i18nRoutes = require("./i18nRoutes.config");

const i18nRewriteRules = Object.entries(i18nRoutes).flatMap(
  ([destination, sources]) =>
    sources.map(({ source, locale }) => ({
      destination,
      source: `/${locale}${source}`,
      locale: false,
    }))
);

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  i18n: {
    // These values should correspond to the slug field in the headless CMS
    locales: ["fi", "sv", "en"],
    // Will be used for non-localized paths
    defaultLocale: "fi",
  },
  async rewrites() {
    return i18nRewriteRules;
  },
  images: {
    domains: ["liikunta.content.api.hel.fi"],
  },
};
