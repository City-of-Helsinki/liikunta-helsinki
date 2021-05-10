import { ApolloClient, InMemoryCache } from "@apollo/client";

import Config from "../config";

const cmsClient = new ApolloClient({
  uri: Config.cmsGraphqlEndpoint,
  cache: new InMemoryCache(),
});

export default cmsClient;
