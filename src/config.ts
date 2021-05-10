class Config {
  private static getEnvOrError(variableName: string) {
    const variableValue = process.env[variableName];

    if (!variableValue) {
      throw Error(
        `Environment variable with name ${variableName} was not found`
      );
    }

    return variableValue;
  }

  static get cmsGraphqlEndpoint() {
    return Config.getEnvOrError("NEXT_PUBLIC_CMS_GRAPHQL_ENDPOINT");
  }
}

export default Config;
