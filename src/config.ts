import { Integrations } from "@sentry/tracing";

import nextConfig from "../next.config";

export type Locale = "fi" | "sv" | "en";

class Config {
  static get cmsGraphqlEndpoint() {
    return getEnvOrError(
      process.env.NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT,
      "NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT"
    );
  }

  static get unifiedSearchGraphqlEndpoint() {
    return getEnvOrError(
      process.env.NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT,
      "NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT"
    );
  }

  static get nextApiGraphqlEndpoint() {
    return getEnvOrError(
      process.env.NEXT_PUBLIC_NEXT_API_GRAPHQL_ENDPOINT,
      "NEXT_PUBLIC_NEXT_API_GRAPHQL_ENDPOINT"
    );
  }

  static get locales() {
    return nextConfig.i18n.locales;
  }

  static get defaultLocale() {
    return nextConfig.i18n.defaultLocale;
  }

  static get allowUnauthorizedRequests() {
    return Boolean(process.env.NEXT_PUBLIC_ALLOW_UNAUTHORIZED_REQUESTS);
  }

  static get debug() {
    return Boolean(process.env.NEXT_PUBLIC_DEBUG);
  }

  static get sentryConfiguration() {
    const sentryTraceSammpleConfig = process.env
      .NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE
      ? {
          integrations: [new Integrations.BrowserTracing()],
          tracesSampleRate: Number(
            process.env.NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE
          ),
        }
      : {};

    return {
      // TODO: add release version to Sentry config
      // release: "my-project-name@2.3.12",
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
      ...sentryTraceSammpleConfig,
    };
  }

  static get isHaukiEnabled() {
    // Hauki is not production ready; disable it by default
    return parseEnvValue(process.env.NEXT_PUBLIC_HAUKI_ENABLED, false);
  }

  static get matomoConfiguration() {
    const matomoUrlBase = "//webanalytics.digiaiiris.com/js/";
    const matomoEnabled = process.env.NEXT_PUBLIC_MATOMO_ENABLED;
    const matomoSiteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;
    const getMatomoUrlPath = (path: string) => `${matomoUrlBase}${path}`;

    if (matomoEnabled && matomoSiteId) {
      return {
        disabled: !Boolean(Number(matomoEnabled)),
        urlBase: matomoUrlBase as string,
        srcUrl: getMatomoUrlPath("piwik.min.js"),
        trackerUrl: getMatomoUrlPath("tracker.php"),
        siteId: Number(matomoSiteId),
      };
    }
    return null;
  }

  static get defaultRevalidate() {
    const envValue = process.env.NEXT_PUBLIC_DEFAULT_ISR_REVALIDATE_SECONDS;
    const value = envValue ? parseEnvValue(envValue) : 10;

    if (typeof value !== "number") {
      throw Error(
        "NEXT_PUBLIC_DEFAULT_ISR_REVALIDATE_SECONDS must be parsed into a number"
      );
    }

    return value;
  }
}

function parseEnvValue(
  value?: string,
  defaultValue: boolean | string | number = null
) {
  if (!value) {
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}

// Accept both variable and name so that variable can be correctly replaced
// by build.
// process.env.VAR => value
// process.env["VAR"] => no value
// Name is used to make debugging easier.
function getEnvOrError(variable?: string, name?: string) {
  if (!variable) {
    throw Error(`Environment variable with name ${name} was not found`);
  }

  return variable;
}

export default Config;
