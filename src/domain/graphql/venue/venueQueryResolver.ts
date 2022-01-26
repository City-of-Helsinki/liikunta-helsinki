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
import { LiikuntaServerConfig } from "../createApolloServer";

const resolvers: Map<Source, (config: LiikuntaServerConfig) => VenueResolver> =
  new Map();
resolvers.set(
  Sources.TPREK,
  (config) =>
    new VenueResolver({
      integrations: [
        new VenueTprekIntegration({
          enrichers: [new VenueOntologyEnricher()],
        }),
        config.haukiEnabled
          ? new VenueHaukiIntegration({
              getId: (id, source) => `${source}:${id}`,
            })
          : null,
      ].filter((item) => item),
    })
);
resolvers.set(
  Sources.LINKED,
  (config) =>
    new VenueResolver({
      integrations: [
        new VenueLinkedIntegration({
          enrichers: [],
        }),
        config.haukiEnabled
          ? new VenueHaukiIntegration({
              // I'm not sure if we can expect for this to always work
              getId: (id) => `tprek:${id}`,
            })
          : null,
      ].filter((item) => item),
    })
);

async function resolver(
  _,
  { id: idWithSource },
  { language, dataSources, haukiEnabled }
) {
  const [source, id] = parseVenueId(idWithSource);
  const dataResolverFactory = resolvers.get(source) ?? null;
  const dataResolver = dataResolverFactory({ haukiEnabled });

  return dataResolver.resolveVenue(id, source, { language, dataSources });
}

function onError(e: unknown) {
  if (e instanceof IdParseError) {
    throw new ApolloError("Invalid ID parameter");
  }
}

export default createQueryResolver(resolver, onError);
