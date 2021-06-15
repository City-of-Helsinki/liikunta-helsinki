import nextConfig from "../next.config";

class Config {
  private static getEnvOrError(variable?: string) {
    if (!variable) {
      throw Error(`Environment variable with name ${variable} was not found`);
    }

    return variable;
  }

  static get cmsGraphqlEndpoint() {
    return Config.getEnvOrError(process.env.NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT);
  }

  static get unifiedSearchGraphqlEndpoint() {
    return Config.getEnvOrError(
      process.env.NEXT_PUBLIC_UNIFIED_SEARCH_GRAPHQL_ENDPOINT
    );
  }

  static get nextApiEndpoint() {
    return Config.getEnvOrError(process.env.NEXT_PUBLIC_NEXT_API_ENDPOINT);
  }

  static get locales() {
    return nextConfig.i18n.locales;
  }

  static get defaultLocale() {
    return nextConfig.i18n.defaultLocale;
  }
}

export type Locale = typeof Config.locales[number];

export default Config;
