import linked from "../dataSources/linked";
import createQueryResolver from "../createQueryResolver";

async function resolver(_, { id }, { language }) {
  return linked.getUpcomingEvents(id, language);
}

export default createQueryResolver(resolver);
