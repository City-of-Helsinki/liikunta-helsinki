import AppConfig from "../../domain/app/AppConfig";
import createApolloServer from "../../domain/graphql/createApolloServer";

const apolloServer = createApolloServer({
  haukiEnabled: AppConfig.isHaukiEnabled,
});
const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
