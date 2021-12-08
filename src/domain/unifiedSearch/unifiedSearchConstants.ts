export const OrderDir = {
  asc: "asc",
  desc: "desc",
} as const;

export type OrderDirType = typeof OrderDir[keyof typeof OrderDir];

export const OrderBy = {
  relevance: "relevance",
  distance: "distance",
  name: "name",
} as const;

export type OrderByType = typeof OrderBy[keyof typeof OrderBy];

export const orderDirToUnifiedSearchDistanceOrder = {
  asc: "ASCENDING",
  desc: "DESCENDING",
} as const;

export type UnifiedSearchOrderBy =
  typeof orderDirToUnifiedSearchDistanceOrder[keyof typeof orderDirToUnifiedSearchDistanceOrder];
