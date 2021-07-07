import { ApolloError } from "apollo-server-micro";

import { graphqlLogger as logger } from "../../logger";
import { Source } from "../../../types";
import { Sources } from "../../../constants";
import parseVenueId, { IdParseError } from "../utils/parseVenueId";
import VenueHaukiIntegration from "./instructions/VenueHaukiIntegration";
import VenueOntologyEnricher from "./instructions/VenueOntologyEnricher";
import VenueResolver from "./instructions/VenueResolver";
import VenueTprekIntegration from "./instructions/VenueTprekIntegration";
import VenueLinkedIntegration from "./instructions/VenueLinkedIntegration";

const resolvers: Map<Source, VenueResolver> = new Map();
resolvers.set(
  Sources.TPREK,
  new VenueResolver({
    integrations: [
      new VenueTprekIntegration({
        enrichers: [new VenueOntologyEnricher()],
      }),
      new VenueHaukiIntegration({
        getId: (id, source) => `${source}:${id}`,
      }),
    ],
  })
);
resolvers.set(
  Sources.LINKED,
  new VenueResolver({
    integrations: [
      new VenueLinkedIntegration({
        enrichers: [],
      }),
      new VenueHaukiIntegration({
        // I'm not sure if we can expect for this to always work
        getId: (id) => `tprek:${id}`,
      }),
    ],
  })
);

async function venueQueryResolver(_, { id: idWithSource }, { language }) {
  logger.debug(`Querying venue: ${idWithSource}, ${language}`);

  try {
    const [source, id] = parseVenueId(idWithSource);
    const dataResolver = resolvers.get(source) ?? null;
    const venue = await dataResolver.resolveVenue(id, source, { language });

    return venue;
  } catch (e) {
    logger.error(`Error while querying venue with ${idWithSource}:`, e);

    if (e instanceof IdParseError) {
      throw new ApolloError("Invalid ID parameter");
    }

    if (e instanceof ApolloError) {
      throw e;
    }

    // Hide any unexpected errors in order to avoid accidentally leaking too
    // much information.
    throw new ApolloError("Internal server error");
  }
}

export default venueQueryResolver;
