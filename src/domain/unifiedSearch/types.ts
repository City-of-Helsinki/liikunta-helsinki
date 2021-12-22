import {
  SearchListQueryVariables,
  OpeningHours,
  OpeningHoursTimes,
} from "./graphql/__generated__";
import { OrderByType, OrderDirType } from "./unifiedSearchConstants";

export type UnifiedSearchParameters = {
  q?: string[];
  administrativeDivisionIds?: string[];
  ontologyTreeIds?: number[];
  ontologyWordIds?: number[];
  after?: string;
  first?: number;
  ontology?: string;
  isOpenNow?: boolean;
  openAt?: Date;
  orderBy?: OrderByType;
  orderDir?: OrderDirType;
};
export type UnifiedSearchVariables = SearchListQueryVariables;
export type UnifiedSearchOpeningHours = OpeningHours;
export type UnifiedSearchOpeningHoursTimes = OpeningHoursTimes;
