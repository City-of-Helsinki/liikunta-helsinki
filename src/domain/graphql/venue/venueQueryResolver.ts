import { ApolloError } from "apollo-server-micro";

import { Source } from "../../../types";
import { Sources } from "../../../constants";
import parseVenueId, { IdParseError } from "./parseVenueId";
import VenueHaukiIntegration from "./instructions/VenueHaukiIntegration";
import VenueOntologyEnricher from "./instructions/VenueOntologyEnricher";
import VenueResolver from "./instructions/VenueResolver";
import VenueTprekIntegration from "./instructions/VenueTprekIntegration";
import VenueLinkedIntegration from "./instructions/VenueLinkedIntegration";
import createQueryResolver from "../createQueryResolver";

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

async function resolver(_, { id: idWithSource }, { language }) {
  const [source, id] = parseVenueId(idWithSource);
  const dataResolver = resolvers.get(source) ?? null;
  const venue = await dataResolver.resolveVenue(id, source, { language });

  return venue;
}

function onError(e: unknown) {
  if (e instanceof IdParseError) {
    throw new ApolloError("Invalid ID parameter");
  }
}

const venueQueryResolver = createQueryResolver(resolver, onError);

export default venueQueryResolver;
