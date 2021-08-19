import { ApolloServer } from "apollo-server-micro";
import accepts from "accepts";
import { NextApiRequest } from "next";
import { gql } from "@apollo/client";

import Config from "../../config";
import venueSchema from "../../domain/graphql/venue/venueSchema";
import venueQueryResolver from "../../domain/graphql/venue/venueQueryResolver";
import Venue from "../../domain/graphql/venue/venueResolver";
import eventSchema from "../../domain/graphql/event/eventSchema";
import upcomingEventsQueryResolver from "../../domain/graphql/event/upcomingEventsQueryResolver";
import Event from "../../domain/graphql/event/eventResolver";
import Hauki from "../../domain/graphql/dataSources/Hauki";
import Tprek from "../../domain/graphql/dataSources/Tprek";
import Linked from "../../domain/graphql/dataSources/Linked";
import LiikuntaLoggerPlugin from "../../domain/graphql/LiikuntaLoggerPlugin";
import eventsQueryResolver from "../../domain/graphql/event/eventsQueryResolver";
import { createCursor, readCursor } from "../../domain/graphql/utils";

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

function getCurrentPage(previous?: string, next?: string): number {
  if (!previous && next) {
    return 1;
  }

  if (previous && !next) {
    return Number(new URL(previous).searchParams.get("page")) + 1;
  }

  if (next) {
    return Number(new URL(next).searchParams.get("page")) - 1;
  }

  return 1;
}

type LinkedCursor = {
  where: Record<string, unknown>;
};

const LinkedPaginatedConnectionResolver = {
  edges({ data: items }) {
    return items.map((item) => ({
      node: item,
      cursor: null,
    }));
  },
  totalCount({ meta: { count } }) {
    return count;
  },
  pageInfo({ meta: { next, previous }, data, args: { where, after, first } }) {
    const hasPreviousPage = Boolean(previous);
    const hasNextPage = Boolean(next);
    const query = after ? readCursor<LinkedCursor>(after).where : where;

    const currentPage = getCurrentPage(previous, next);

    return {
      hasPreviousPage,
      hasNextPage,
      startCursor: createCursor({
        where: query,
        first,
        page: currentPage,
      }),
      endCursor: createCursor({
        where: query,
        first,
        page: currentPage,
      }),
      count: data.length,
    };
  },
};

const typeDefs = [initQueryTypeDefs, venueSchema, eventSchema];
const dataSources = () => ({
  hauki: new Hauki(),
  tprek: new Tprek(),
  linked: new Linked(),
});

const resolvers = {
  Query: {
    venue: venueQueryResolver,
    upcomingEvents: upcomingEventsQueryResolver,
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
  tracing: process.env.NODE_ENV !== "production",
  context: ({ req }) => {
    const language = acceptsLanguages(req, Config.locales);

    return {
      language,
    };
  },
  plugins: [new LiikuntaLoggerPlugin()],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
