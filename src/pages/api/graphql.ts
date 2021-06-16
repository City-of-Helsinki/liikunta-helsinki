import { ApolloServer, gql, ApolloError } from "apollo-server-micro";
import accepts from "accepts";
import { NextApiRequest } from "next";

import Config from "../../config";
import resolveVenue from "../../util/api/resolveVenue";

const typeDefs = gql`
  type Query {
    venue(id: ID!): Venue!
  }

  type Point {
    type: String
    coordinates: [Float!]!
  }

  type Venue {
    addressLocality: String
    dataSource: String
    description: String
    email: String
    id: String!
    image: String
    infoUrl: String
    name: String
    position: Point
    postalCode: String
    streetAddress: String
    telephone: String
  }
`;

const resolvers = {
  Query: {
    async venue(_, { id }, { language }) {
      try {
        const venue = await resolveVenue(id, language);

        return venue;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
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
