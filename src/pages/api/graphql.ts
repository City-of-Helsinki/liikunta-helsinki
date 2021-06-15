import { ApolloServer, gql, ApolloError } from "apollo-server-micro";
import accepts from "accepts";
import { NextApiRequest } from "next";

import { graphqlLogger as logger } from "../../logger";
import Config from "../../config";
import resolveVenue from "../../util/api/resolveVenue";
import parseVenueId, { IdParseError } from "../../util/api/parseVenueId";
import hauki from "../../dataSources/hauki";

const typeDefs = gql`
  type Query {
    venue(id: ID!): Venue!
  }

  type Point {
    type: String
    coordinates: [Float!]!
  }

  enum ResourceState {
    open
    closed
    undefined
    self_service
    with_key
    with_reservation
    open_and_reservable
    with_key_and_reservation
    enter_only
    exit_only
    weather_permitting
  }

  type Time {
    name: String!
    description: String!
    startTime: String!
    endTime: String!
    endTimeOnNextDay: Boolean!
    resourceState: ResourceState!
    fullDay: Boolean!
    periods: [Int!]!
  }

  type OpeningHour {
    date: String!
    times: [Time!]!
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
    openingHours: [OpeningHour!]
    isOpen: Boolean
  }
`;

function whenOpeningHoursCanBeFoundForId<R>(
  idWithSource: string,
  callback: (safeId: string) => R,
  otherwise: () => R
) {
  logger.debug(
    `Validating whether opening hours can be found from hauki with id ${idWithSource}`
  );

  try {
    const [source] = parseVenueId(idWithSource);

    if (["tprek"].includes(source)) {
      logger.debug(
        `Trying to find opening hours from hauki with id ${idWithSource}`
      );
      return callback(idWithSource);
    }

    logger.debug(
      // eslint-disable-next-line max-len
      `Source "${source}" (from ${idWithSource}) is not known to be discoverable from hauki. Therefore opening hours were not looked up for it.`
    );

    return otherwise();
  } catch (e) {
    if (e instanceof IdParseError) {
      logger.error(
        // eslint-disable-next-line max-len
        `Did not try to find opening hours with id ${idWithSource} because a source could not be parsed from it: ${e.message}`
      );
    } else {
      logger.error(e);
    }

    return otherwise();
  }
}

const resolvers = {
  Query: {
    async venue(_, { id }, { language }) {
      logger.debug(`Querying venue: ${id}, ${language}`);

      try {
        // This graph is purpose built for the liikunta website. In the views
        // that the venue integration was built for, opening hours are always
        // requested. This is why we request them here, instead on demand.

        // By using Promise.all, we are able to decrease loading time by around
        // 100ms.

        // If opening hours are not requested, querying for them would be wasted
        // time. However, as stated earlier, this was not a common case at the
        // time this resolver was implemented.
        const haukiDataResolvers = whenOpeningHoursCanBeFoundForId(
          id,
          (haukiId) => [
            hauki.getIsOpen(haukiId),
            hauki.getOpeningHours(haukiId),
          ],
          () => [Promise.resolve(null), Promise.resolve(null)]
        );
        const [venue, isOpen, openingHours] = await Promise.all([
          resolveVenue(id, language),
          ...haukiDataResolvers,
        ]);

        return { ...venue, isOpen, openingHours };
      } catch (e) {
        logger.error(`Error while querying venue with ${id}:`, e);
        throw new ApolloError(e.message);
      }
    },
  },
  Venue: {
    addressLocality({ addressLocality }) {
      return addressLocality;
    },
    dataSource({ dataSource }) {
      return dataSource;
    },
    description({ description }) {
      return description;
    },
    email({ email }) {
      return email;
    },
    id({ id }) {
      return id;
    },
    image({ image }) {
      return image;
    },
    infoUrl({ infoUrl }) {
      return infoUrl;
    },
    name({ name }) {
      return name;
    },
    position({ position }) {
      return position;
    },
    postalCode({ postalCode }) {
      return postalCode;
    },
    streetAddress({ streetAddress }) {
      return streetAddress;
    },
    telephone({ telephone }) {
      return telephone;
    },
    openingHours({ openingHours }) {
      return openingHours;
    },
    isOpen({ isOpen }) {
      return isOpen;
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
