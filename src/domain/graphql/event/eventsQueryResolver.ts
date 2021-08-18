import createQueryResolver from "../createQueryResolver";

async function resolver(_, { where }, { language, dataSources }) {
  return dataSources.linked.getEvents(where, language);
}

export default createQueryResolver(resolver);
