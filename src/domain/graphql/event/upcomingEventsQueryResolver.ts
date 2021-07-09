import linked from "../dataSources/linked";
import createQueryResolver from "../createQueryResolver";

async function resolver(_, { id }, { language }) {
  return linked.getUpcomingEvents(id, language);
}

const venueQueryResolver = createQueryResolver(resolver);

export default venueQueryResolver;
