import React from "react";
import {
  FetchMoreOptions,
  FetchMoreQueryOptions,
  OperationVariables,
} from "@apollo/client";
import { useCallback } from "react";

import { FetchMoreFunction } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Options<TData = any, TVariables = OperationVariables> = {
  fetchMore: FetchMoreFunction<TData, TVariables>;
  moreResultsAnnouncerRef: React.RefObject<HTMLElement>;
  hasNextPage: boolean;
  count: number;
  totalCount: number;
  pageSize: number;
  visibleCount: number;
};

type A11yHelpers = {
  a11yIndex: number;
  loadedMoreAmount: number;
  resultsLeft: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnValue<TData = any, TVariables = OperationVariables> = A11yHelpers & {
  fetchMore: FetchMoreFunction<TData, TVariables>;
};

export default function useA11yPagination<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables = OperationVariables
>({
  fetchMore: fetchMoreBase,
  moreResultsAnnouncerRef,
  hasNextPage,
  count,
  totalCount,
  pageSize,
  visibleCount,
}: Options<TData, TVariables>): ReturnValue<TData, TVariables> {
  const fetchMore = useCallback(
    async <K extends keyof TVariables>(
      fetchMoreOptions: FetchMoreQueryOptions<TVariables, K, TData> &
        FetchMoreOptions<TData, TVariables>
    ) => {
      const result = await fetchMoreBase(fetchMoreOptions);

      if (moreResultsAnnouncerRef.current) {
        moreResultsAnnouncerRef.current.focus();
      }

      return result;
    },
    [fetchMoreBase, moreResultsAnnouncerRef]
  );

  const resultsLeft = totalCount ? totalCount - visibleCount : 0;
  const a11yIndex = (Math.floor(count / pageSize) - 1) * pageSize;
  const loadedMoreAmount = hasNextPage ? pageSize : totalCount - count;

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchMore,
    a11yIndex,
    loadedMoreAmount,
    resultsLeft,
  };
}
