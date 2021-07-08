import linked from "../dataSources/linked";
import createQueryResolver from "./createQueryResolver";

async function resolver(_, { id }, { language }) {
  const events = linked.getUpcomingEvents(id, language);

  return events;
}

const venueQueryResolver = createQueryResolver(resolver);

export default venueQueryResolver;
