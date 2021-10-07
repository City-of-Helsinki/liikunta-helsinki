import React, { useLayoutEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Options = {
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

export default function useA11yPagination({
  moreResultsAnnouncerRef,
  totalCount,
  pageSize,
  visibleCount,
}: Options): A11yHelpers {
  useLayoutEffect(() => {
    if (moreResultsAnnouncerRef.current) {
      // Render announcer to correct position without breaking flow of grid
      // 1. Change announcer elements position to static
      // 2. Take offsetTop value when position is static
      // 3. Apply position absolute and offsetTop value to top style
      moreResultsAnnouncerRef.current.style.position = "static";
      const offsetTop = moreResultsAnnouncerRef?.current?.offsetTop;
      moreResultsAnnouncerRef.current.style.position = "absolute";
      moreResultsAnnouncerRef.current.style.top = `${offsetTop.toString()}px`;

      // The announcer element is hidden from visual users and as such may
      // exist in an unnatural place (visually) on the rendered page. If so,
      // the browser can scroll into an unexpected position. This is true for
      // instance when the announcer element is absolutely positioned within
      // a grid.
      moreResultsAnnouncerRef.current.focus({ preventScroll: true });
    }
  }, [totalCount, visibleCount, pageSize, moreResultsAnnouncerRef]);

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
    a11yIndex,
    loadedMoreAmount,
    resultsLeft,
  };
}
