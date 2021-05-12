import { InMemoryCache } from "@apollo/client";

import Config from "../config";
import LiikuntaApolloClient from "./LiikuntaApolloClient";

const cmsClient = new LiikuntaApolloClient({
  uri: Config.cmsGraphqlEndpoint,
  cache: new InMemoryCache(),
});

export default cmsClient;
