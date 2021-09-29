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
  orderBy?: "distance";
  orderDir?: "asc" | "desc";
};
