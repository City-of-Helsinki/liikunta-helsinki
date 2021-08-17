import createQueryResolver from "../createQueryResolver";

async function resolver(_, { id }, { language, dataSources }) {
  return dataSources.linked.getUpcomingEvents(id, language);
}

export default createQueryResolver(resolver);
