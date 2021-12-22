import { SortOrder } from "./graphql/__generated__";

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
  asc: SortOrder.Ascending,
  desc: SortOrder.Descending,
} as const;

export type UnifiedSearchOrderBy =
  typeof orderDirToUnifiedSearchDistanceOrder[keyof typeof orderDirToUnifiedSearchDistanceOrder];
