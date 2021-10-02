import { useCallback, useMemo, useRef } from "react";
import { NextRouter, useRouter } from "next/router";
import queryString from "query-string";
import fastDeepEqual from "fast-deep-equal/react";

import defaultQueryPersister, {
  QueryPersister,
} from "../../common/utils/queryPersister";
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

function parseBoolean(value?: string | string[]): boolean | undefined {
  if (!value || Array.isArray(value)) {
    return;
  }

  return value === "true";
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
): string | number | boolean {
  switch (type) {
    case "string":
      return stringifyQueryValue(value);
    case "number":
      return parseNumber(value);
    case "boolean":
      return parseBoolean(value);
    default:
      throw Error(`Type "${type}" is not supported`);
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

  if (type === "string" || type === "number" || type === "boolean") {
    const parsedValue = parseIntoValue(value, type);

    return {
      [key]: parsedValue,
    };
  }
}

function getSafeArrayValue(value?: string | string[]) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

type FilterConfig = {
  type: "string" | "number" | "boolean";
  storeBehaviour?: "list" | "accumulating";
  key: string;
};

type SpreadFilter = {
  key: string;
  value: string | number | boolean;
};

type TransitionOptions = {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
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
      { type: "boolean", key: "isOpenNow" },
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

  setFilters(
    search: UnifiedSearchParameters,
    pathname?: string,
    options?: TransitionOptions
  ) {
    this.queryPersister.persistQuery(search);

    this.router.replace(
      {
        pathname,
        query: search,
      },
      null,
      options
    );
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
      const isInSearch = Object.keys(search).includes(key);
      const value = search[key];
      const previousValue = this.query[key];

      if (this.getIsArrayKind(filterConfig)) {
        const safePreviousValues = getSafeArrayValue(previousValue);

        if (!isInSearch) {
          return {
            ...acc,
            [key]: safePreviousValues,
          };
        }

        const safeValues = Array.isArray(value) ? value : [value];

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

      if (!isInSearch) {
        return {
          ...acc,
          [key]: previousValue,
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
    (...params: Parameters<typeof unifiedSearch.setFilters>) => {
      unifiedSearch.setFilters(...params);
    },
    [unifiedSearch]
  );

  const modifyFilters = useCallback(
    (...params: Parameters<typeof unifiedSearch.modifyFilters>) =>
      unifiedSearch.modifyFilters(...params),
    [unifiedSearch]
  );

  const getFiltersWithout = useCallback(
    (...params: Parameters<typeof unifiedSearch.getFiltersWithout>) =>
      unifiedSearch.getFiltersWithout(...params),
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
