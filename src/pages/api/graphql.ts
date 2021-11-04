import { ApolloServer } from "apollo-server-micro";
import accepts from "accepts";
import { NextApiRequest } from "next";
import { gql } from "@apollo/client";

import Config from "../../config";
import venueSchema from "../../domain/graphql/venue/venueSchema";
import venueQueryResolver from "../../domain/graphql/venue/venueQueryResolver";
import Venue from "../../domain/graphql/venue/venueResolver";
import eventSchema from "../../domain/graphql/event/eventSchema";
import Event from "../../domain/graphql/event/eventResolver";
import Hauki from "../../domain/graphql/services/HaukiDataSource";
import Tprek from "../../domain/graphql/services/TprekDataSource";
import Linked from "../../domain/graphql/services/linked/LinkedDataSource";
import LinkedPaginatedConnectionResolver from "../../domain/graphql/services/linked/LinkedPaginatedConnectionResolver";
import LiikuntaLoggerPlugin from "../../domain/graphql/LiikuntaLoggerPlugin";
import eventsQueryResolver from "../../domain/graphql/event/eventsQueryResolver";

// Note: In the current version of GraphQL, you can’t have an empty type even if
// you intend to extend it later. So we need to make sure the Query type has at
// least one field — in this case we can add a fake _empty field. Hopefully in
// future versions it will be possible to have an empty type to be extended
// later.
// https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/
const initQueryTypeDefs = gql`
  type Query {
    _empty: String
  }
`;

const typeDefs = [initQueryTypeDefs, venueSchema, eventSchema];
const dataSources = () => ({
  hauki: new Hauki(),
  tprek: new Tprek(),
  linked: new Linked(),
});

const resolvers = {
  Query: {
    venue: venueQueryResolver,
    events: eventsQueryResolver,
  },
  Venue,
  EventsConnection: LinkedPaginatedConnectionResolver,
  Event,
};

function acceptsLanguages(
  req: NextApiRequest,
  languages: string[]
): typeof languages[number] | false {
  const accept = accepts(req);

  return accept.languages(languages);
}

const apolloServer = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  // Uncomment line below to enable apollo tracing
  // plugins: [require('apollo-tracing').plugin()]
  context: ({ req }) => {
    const language = acceptsLanguages(req, Config.locales);

    return {
      language,
    };
  },
  plugins: [new LiikuntaLoggerPlugin()],
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
