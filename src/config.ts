import { Integrations } from "@sentry/tracing";

import nextConfig from "../next.config";

class Config {
  static get cmsGraphqlEndpoint() {
    return Config.getEnvOrError(
      process.env.NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT,
      "NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT"
    );
  }

  static get unifiedSearchGraphqlEndpoint() {
    return Config.getEnvOrError(
      process.env.NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT,
      "NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT"
    );
  }

  static get nextApiGraphqlEndpoint() {
    return Config.getEnvOrError(
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
    return Config.getFlag(process.env.NEXT_PUBLIC_HAUKI_ENABLED, false);
  }

  static get matomoConfiguration() {
    const matomoUrlBase = this.getEnvOrError(
      process.env.NEXT_PUBLIC_MATOMO_URL_BASE
    );
    const matomoEnabled = this.getEnvOrError(
      process.env.NEXT_PUBLIC_MATOMO_ENABLED
    );
    const matomoSitedId = this.getEnvOrError(
      process.env.NEXT_PUBLIC_MATOMO_SITE_ID
    );
    const getMatomoUrlPath = (path: string) => `${matomoUrlBase}${path}`;

    return {
      disabled: !Boolean(Number(matomoEnabled)),
      urlBase: matomoUrlBase as string,
      srcUrl: getMatomoUrlPath("piwik.min.js"),
      trackerUrl: getMatomoUrlPath("tracker.php"),
      siteId: Number(matomoSitedId),
    };
  }

  private static getEnvOrError(variable?: string, name?: string) {
    if (!variable) {
      throw Error(`Environment variable with name ${name} was not found`);
    }

    return variable;
  }

  private static getFlag(
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
}

export type Locale = "fi" | "sv" | "en";

export default Config;
