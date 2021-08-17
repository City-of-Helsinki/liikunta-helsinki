import createQueryResolver from "../createQueryResolver";

async function resolver(_, { ids }, { language, dataSources }) {
  return dataSources.linked.getEventsByIds(ids, language);
}

export default createQueryResolver(resolver);
