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
}

export default Config;
