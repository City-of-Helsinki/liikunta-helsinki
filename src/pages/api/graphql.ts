import { withSentry } from "@sentry/nextjs";

import AppConfig from "../../domain/app/AppConfig";
import createApolloServer from "../../domain/graphql/createApolloServer";

const apolloServer = createApolloServer({
  haukiEnabled: AppConfig.isHaukiEnabled,
});
const startServer = apolloServer.start();

const handler = async (req, res) => {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
};

export default withSentry(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
