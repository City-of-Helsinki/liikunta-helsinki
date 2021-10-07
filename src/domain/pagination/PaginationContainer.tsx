import React, { useRef } from "react";
import { LoadingSpinner, Button } from "hds-react";
import { OperationVariables } from "@apollo/client";

import { PageInfo } from "../../types";
import useA11yPagination from "./usePagination";
import Text from "../../common/components/text/Text";
import List from "../../common/components/list/List";
import styles from "./paginationContainer.module.scss";
import { FetchMoreFunction } from "./types";

const a11yListItemFactory =
  ({
    a11yIndex,
    ref,
    loadedMoreAmount,
    loading,
    loadingMoreLabel,
    nMoreResultsLabel,
  }) =>
  ({ className, children, index }) => {
    const item = <li className={className}>{children}</li>;

    if (a11yIndex > 0 && a11yIndex === index) {
      return (
        <>
          <li
            className={styles.loadMoreAnnouncer}
            tabIndex={-1}
            ref={ref}
            aria-label={
              loading
                ? loadingMoreLabel
                : `${loadedMoreAmount} ${nMoreResultsLabel}`
            }
          />
          {item}
        </>
      );
    }

    return item;
  };

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchMore: FetchMoreFunction<any, OperationVariables>;
  pageInfo: PageInfo;
  loading: boolean;
  elements: React.ReactElement[];
  totalCount: number;
  pageSize: number;
  showNoMoreItemsToLoadNotice?: boolean;
  showMoreLabel: string;
  noMoreResultsLabel: string;
  loadingMoreLabel: string;
  nMoreResultsLabel: string;
};

export default function PaginationContainer({
  fetchMore,
  pageInfo,
  loading,
  elements,
  totalCount,
  pageSize,
  showNoMoreItemsToLoadNotice = false,
  showMoreLabel,
  noMoreResultsLabel,
  loadingMoreLabel,
  nMoreResultsLabel,
}: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const { loadedMoreAmount, a11yIndex, resultsLeft } = useA11yPagination({
    moreResultsAnnouncerRef: ref,
    visibleCount: elements.length,
    totalCount,
    pageSize,
  });

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        after: pageInfo?.endCursor,
        first: pageSize,
      },
    });
  };

  const Li = a11yListItemFactory({
    a11yIndex,
    ref,
    loadedMoreAmount,
    loading,
    loadingMoreLabel,
    nMoreResultsLabel,
  });
  const hasNextPage = pageInfo?.hasNextPage;

  return (
    <>
      <List variant="grid-2" items={elements} li={Li} />
      <LoadingSpinner hidden={!loading} className={styles.spinner} />
      {!loading && (
        <>
          {hasNextPage ? (
            <Button onClick={handleLoadMore} className={styles.loadMore}>
              {showMoreLabel} ({resultsLeft})
            </Button>
          ) : (
            showNoMoreItemsToLoadNotice && (
              <Text variant="body">{noMoreResultsLabel}</Text>
            )
          )}
        </>
      )}
    </>
  );
}
