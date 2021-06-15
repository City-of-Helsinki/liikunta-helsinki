import nextConfig from "../next.config";

class Config {
  private static getEnvOrError(variable?: string, name?: string) {
    if (!variable) {
      throw Error(`Environment variable with name ${name} was not found`);
    }

    return variable;
  }

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
}

export type Locale = typeof Config.locales[number];

export default Config;
