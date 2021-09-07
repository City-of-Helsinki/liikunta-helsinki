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
        // The announcer element is hidden from visual users and as such may
        // exist in an unnatural place (visually) on the rendered page. If so,
        // the browser can scroll into an unexpected position. This is true for
        // instance when the announcer element is absolutely positioned within
        // a grid.
        moreResultsAnnouncerRef.current.focus({ preventScroll: true });
      }

      return result;
    },
    [fetchMoreBase, moreResultsAnnouncerRef]
  );

  const totalBlocks = Math.ceil(totalCount / pageSize);
  const currentBlock = Math.ceil(visibleCount / pageSize);
  const previousBlock = currentBlock === 1 ? null : currentBlock - 1;
  const resultsLeft = totalCount - visibleCount;
  // Index after the items of a single page
  const a11yIndex = previousBlock * pageSize;
  const lasBlockSize =
    totalCount - Math.floor(totalCount / pageSize) * pageSize;
  const loadedMoreAmount =
    currentBlock === totalBlocks ? lasBlockSize : pageSize;

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchMore,
    a11yIndex,
    loadedMoreAmount,
    resultsLeft,
  };
}
