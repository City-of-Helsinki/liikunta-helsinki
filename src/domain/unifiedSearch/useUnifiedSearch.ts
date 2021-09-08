import { useCallback, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";

import queryPersister from "../../util/queryPersister";
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

  return value.includes(",") ? value.split(",") : [value];
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

function filterConfigToObject({ type, key }: FilterConfig, values) {
  if (type === "array") {
    return {
      [key]: makeArray(values[key]),
    };
  }

  if (type === "string") {
    return {
      [key]: stringifyQueryValue(values[key]),
    };
  }

  if (type === "number") {
    return {
      [key]: parseNumber(values[key]),
    };
  }
}

type FilterConfig = {
  type: "string" | "array" | "number";
  key: string;
};

type SpreadFilter = {
  key: string;
  value: string | number;
};

class UnifiedSearch {
  router: NextRouter;
  filterConfig: FilterConfig[];

  constructor(router: NextRouter) {
    this.router = router;
    this.filterConfig = [
      { type: "array", key: "q" },
      { type: "string", key: "administrativeDivisionId" },
    ];
  }

  get filters(): UnifiedSearchParameters {
    const {
      query,
      query: { after, first },
    } = this.router;
    const filters = this.filterConfig.reduce(
      (acc, filter) => ({
        ...acc,
        ...filterConfigToObject(filter, query),
      }),
      {}
    );

    return dropUndefined({
      ...filters,
      after: stringifyQueryValue(after),
      first: parseNumber(first),
    });
  }

  setFilters(search: UnifiedSearchParameters, pathname?: string) {
    queryPersister.persistQuery(search);

    this.router.replace({
      pathname,
      query: search,
    });
  }

  get filterList(): SpreadFilter[] {
    const { query } = this.router;
    const filters = this.filterConfig.flatMap(({ type, key }) => {
      const value = query[key];

      if (!value) {
        return null;
      }

      if (type === "array" && Array.isArray(value)) {
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

  getSearchParamsFromFilters(filters: SpreadFilter[]): UnifiedSearchParameters {
    return filters.reduce((acc, { key, value }) => {
      const config = this.filterConfig.find(
        (filterConfig) => filterConfig.key === key
      );

      if (config.type === "array") {
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
    const { query } = this.router;
    const nextFilters = this.filterConfig.reduce((acc, { type, key }) => {
      const value = search[key];
      const previousValue = query[key] ?? [];

      if (type === "array") {
        const safePreviousValue = Array.isArray(previousValue)
          ? previousValue
          : [previousValue];

        if (safePreviousValue.includes(value[0])) {
          return {
            ...acc,
            [key]: safePreviousValue,
          };
        }

        const nextValues = [...safePreviousValue, ...value].filter(
          (item) => item
        );

        return {
          ...acc,
          [key]: nextValues,
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
    filters: unifiedSearch.filters,
    filterList: unifiedSearch.filterList,
    setFilters,
    modifyFilters,
    getFiltersWithout,
  };
}
