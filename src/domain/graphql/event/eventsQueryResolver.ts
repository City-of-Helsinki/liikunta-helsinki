import createQueryResolver from "../createQueryResolver";
import { readCursor } from "../utils/cursorUtils";

function getQuery({ where, first, after }) {
  // If a cursor is used, rely on it to find query data
  if (after) {
    const { first, page, where } = readCursor(after);

    return {
      ...where,
      pageSize: first,
      page: page + 1,
    };
  }

  return {
    ...where,
    pageSize: first,
  };
}

async function resolver(_, args, { language, dataSources }) {
  const query = getQuery(args);
  const result = await dataSources.linked.getEvents(query, language);

  return { ...result, args };
}

export default createQueryResolver(resolver);
