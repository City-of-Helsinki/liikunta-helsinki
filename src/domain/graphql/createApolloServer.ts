import {
  ApolloServer,
  Config as ApolloServerConfig,
} from "apollo-server-micro";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
  Context,
  ContextFunction,
} from "apollo-server-core";
import accepts from "accepts";
import { NextApiRequest } from "next";
import { DocumentNode, gql } from "@apollo/client";

import Config from "../../config";
import createVenueSchema from "./venue/venueSchema";
import venueQueryResolver from "./venue/venueQueryResolver";
import venuesByIdsResolver from "./venue/venuesByIdsResolver";
import Venue from "./venue/venueResolver";
import eventSchema from "./event/eventSchema";
import Event from "./event/eventResolver";
import Hauki from "./services/HaukiDataSource";
import Tprek from "./services/TprekDataSource";
import Linked from "./services/linked/LinkedDataSource";
import LinkedPaginatedConnectionResolver from "./services/linked/LinkedPaginatedConnectionResolver";
import LiikuntaLoggerPlugin from "./LiikuntaLoggerPlugin";
import eventsQueryResolver from "./event/eventsQueryResolver";
import paginationSchema from "./paginationSchema";

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

const typeDefs = (liikuntaServerConfig?: LiikuntaServerConfig) => [
  initQueryTypeDefs,
  paginationSchema,
  createVenueSchema(liikuntaServerConfig),
  eventSchema,
];
const dataSourcesFactory = () => ({
  hauki: new Hauki(),
  tprek: new Tprek(),
  linked: new Linked(),
});

const resolvers = {
  Query: {
    venue: venueQueryResolver,
    venuesByIds: venuesByIdsResolver,
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

function handleContext({ req }) {
  const language = acceptsLanguages(req, Config.locales);

  return {
    language,
  };
}

const plugins = [
  new LiikuntaLoggerPlugin(),
  process.env.NODE_ENV === "production"
    ? ApolloServerPluginLandingPageDisabled
    : ApolloServerPluginLandingPageGraphQLPlayground(),
];

export type LiikuntaServerConfig = {
  haukiEnabled?: boolean;
};

type ServerConfig = Omit<ApolloServerConfig, "typDefs"> &
  LiikuntaServerConfig & {
    typeDefs?: (
      liikuntaServerConfig?: LiikuntaServerConfig
    ) => DocumentNode | Array<DocumentNode> | string | Array<string>;
  };

export default function createApolloServer(apolloServerConfig?: ServerConfig) {
  const injectIntoContext = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: Context | ContextFunction<any>,
    injectedObject: LiikuntaServerConfig
  ) => {
    if (typeof context === "function") {
      return (params) => ({
        ...context(params),
        ...injectedObject,
      });
    }

    return {
      ...context,
      ...injectedObject,
    };
  };
  const liikuntaServerConfig = {
    haukiEnabled: apolloServerConfig?.haukiEnabled,
  };

  return new ApolloServer({
    dataSources: apolloServerConfig?.dataSources ?? dataSourcesFactory,
    typeDefs: (apolloServerConfig?.typeDefs ?? typeDefs)(liikuntaServerConfig),
    resolvers: apolloServerConfig?.resolvers ?? resolvers,
    // Uncomment line below to enable apollo tracing
    // plugins: [require('apollo-tracing').plugin()]
    context: injectIntoContext(
      apolloServerConfig?.context ?? handleContext,
      liikuntaServerConfig
    ),
    plugins: apolloServerConfig?.plugins ?? plugins,
    // Turn off introspection in production because this endpoint is meant
    // for the liikunta site application only
    introspection: process.env.NODE_ENV !== "production",
  });
}
