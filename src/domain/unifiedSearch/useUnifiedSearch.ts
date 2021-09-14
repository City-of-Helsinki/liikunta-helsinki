import { useCallback, useMemo, useRef } from "react";
import { NextRouter, useRouter } from "next/router";
import queryString from "query-string";
import fastDeepEqual from "fast-deep-equal/react";

import defaultQueryPersister, {
  QueryPersister,
} from "../../util/queryPersister";
import { UnifiedSearchParameters } from "./types";

function stringifyQueryValue(value?: string | string[]): string | undefined {
  if (!value) {
    return;
  }

  return Array.isArray(value) ? value.join(",") : value;
}

function makeArray(value?: string | string[]): string[] | undefined {
  if (!value) {
    return;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function parseNumber(value?: string | string[]): number | undefined {
  if (!value || Array.isArray(value)) {
    return;
  }

  return Number(value);
}

function dropUndefined(obj: Record<string, unknown>) {
  const objectWithoutUndefined = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    objectWithoutUndefined[key] = value;
  });

  return objectWithoutUndefined;
}

function parseIntoValue(
  value: string | string[],
  type: FilterConfig["type"]
): string | number {
  if (type === "string") {
    return stringifyQueryValue(value);
  }

  if (type === "number") {
    return parseNumber(value);
  }
}

function filterConfigToObject(
  { type, key, storeBehaviour }: FilterConfig,
  values
) {
  const value = values[key];

  if (storeBehaviour === "list" || storeBehaviour === "accumulating") {
    const valueAsArray = makeArray(value);

    return {
      [key]: valueAsArray?.map((value) => parseIntoValue(value, type)),
    };
  }

  if (type === "string" || type === "number") {
    const parsedValue = parseIntoValue(value, type);

    return {
      [key]: parsedValue,
    };
  }
}

type FilterConfig = {
  type: "string" | "number";
  storeBehaviour?: "list" | "accumulating";
  key: string;
};

type SpreadFilter = {
  key: string;
  value: string | number;
};

export class UnifiedSearch {
  router: NextRouter;
  filterConfig: FilterConfig[];
  queryPersister: QueryPersister;

  constructor(
    router: NextRouter,
    queryPersister: QueryPersister = defaultQueryPersister
  ) {
    this.router = router;
    this.filterConfig = [
      { type: "string", storeBehaviour: "accumulating", key: "q" },
      {
        type: "string",
        storeBehaviour: "list",
        key: "administrativeDivisionIds",
      },
      { type: "number", storeBehaviour: "list", key: "ontologyTreeIds" },
    ];
    this.queryPersister = queryPersister;
  }

  get query() {
    return queryString.parse(this.router.asPath.split(/\?/)[1]);
  }

  get filters(): UnifiedSearchParameters {
    const { after, first } = this.query;
    const filters = this.filterConfig.reduce(
      (acc, filter) => ({
        ...acc,
        ...filterConfigToObject(filter, this.query),
      }),
      {}
    );

    return dropUndefined({
      ...filters,
      after: stringifyQueryValue(after),
      first: parseNumber(first),
    });
  }

  get filterList(): SpreadFilter[] {
    const filters = this.filterConfig.flatMap((filterConfig) => {
      const { key } = filterConfig;
      const value = this.query[key];

      if (!value) {
        return null;
      }

      if (this.getIsArrayKind(filterConfig) && Array.isArray(value)) {
        return value.map((value: string) => ({
          key,
          value,
        }));
      }

      return {
        key,
        value,
      };
    });

    return filters.filter((item) => item?.value) as SpreadFilter[];
  }

  getIsArrayKind(filterConfig: FilterConfig): boolean {
    return (
      filterConfig.storeBehaviour === "list" ||
      filterConfig.storeBehaviour === "accumulating"
    );
  }

  setFilters(search: UnifiedSearchParameters, pathname?: string) {
    this.queryPersister.persistQuery(search);

    this.router.replace({
      pathname,
      query: search,
    });
  }

  getSearchParamsFromFilters(filters: SpreadFilter[]): UnifiedSearchParameters {
    return filters.reduce((acc, { key, value }) => {
      const config = this.filterConfig.find(
        (filterConfig) => filterConfig.key === key
      );

      if (this.getIsArrayKind(config)) {
        const nextValue = [...(acc[key] ?? []), value];

        return {
          ...acc,
          [key]: nextValue,
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});
  }

  modifyFilters(search: Partial<UnifiedSearchParameters>) {
    const nextFilters = this.filterConfig.reduce((acc, filterConfig) => {
      const { key, storeBehaviour } = filterConfig;
      const value = search[key];
      const previousValue = this.query[key] ?? [];

      if (this.getIsArrayKind(filterConfig)) {
        const safeValues = Array.isArray(value) ? value : [value];
        const safePreviousValues = Array.isArray(previousValue)
          ? previousValue
          : [previousValue];

        let nextValues: string[];

        if (storeBehaviour === "accumulating") {
          nextValues = [...safePreviousValues, ...safeValues];
        } else {
          nextValues = safeValues;
        }

        const nextValuesWithoutDuplicates = [
          ...Array.from(new Set(nextValues)),
        ];

        return {
          ...acc,
          [key]: nextValuesWithoutDuplicates.filter((item) => item),
        };
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});
    this.setFilters(dropUndefined(nextFilters));
  }

  getFiltersWithout(key: string, value: string) {
    const nextFilters = this.filterList.filter((filter) => {
      return filter.key !== key || filter.value !== value;
    });

    return this.getSearchParamsFromFilters(nextFilters);
  }
}

export default function useUnifiedSearch() {
  const router = useRouter();
  const unifiedSearch = useMemo(() => new UnifiedSearch(router), [router]);
  const filters = useRef(unifiedSearch.filters);
  const filterList = useRef(unifiedSearch.filterList);

  if (!fastDeepEqual(filters.current, unifiedSearch.filters)) {
    filters.current = unifiedSearch.filters;
  }

  if (!fastDeepEqual(filterList.current, unifiedSearch.filterList)) {
    filterList.current = unifiedSearch.filterList;
  }

  const setFilters = useCallback(
    (search: UnifiedSearchParameters, pathname?: string) => {
      unifiedSearch.setFilters(search, pathname);
    },
    [unifiedSearch]
  );

  const modifyFilters = useCallback(
    (search: Partial<UnifiedSearchParameters>) =>
      unifiedSearch.modifyFilters(search),
    [unifiedSearch]
  );

  const getFiltersWithout = useCallback(
    (key: string, value: string) => unifiedSearch.getFiltersWithout(key, value),
    [unifiedSearch]
  );

  return {
    filters: filters.current,
    filterList: filterList.current,
    setFilters,
    modifyFilters,
    getFiltersWithout,
  };
}
