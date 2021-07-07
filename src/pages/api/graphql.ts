import { ApolloServer } from "apollo-server-micro";
import accepts from "accepts";
import { NextApiRequest } from "next";

import Config from "../../config";
import venueSchema from "../../domain/graphql/schemas/venue";
import venueQueryResolver from "../../domain/graphql/resolvers/venueQuery";
import Venue from "../../domain/graphql/resolvers/venue";

const typeDefs = [venueSchema];

const resolvers = {
  Query: {
    venue: venueQueryResolver,
  },
  Venue,
};

function acceptsLanguages(
  req: NextApiRequest,
  languages: string[]
): typeof languages[number] | false {
  const accept = accepts(req);

  return accept.languages(languages);
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: process.env.NODE_ENV !== "production",
  context: ({ req }) => {
    const language = acceptsLanguages(req, Config.locales);

    return {
      language,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
