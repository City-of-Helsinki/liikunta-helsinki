import React, { useRef } from "react";
import { LoadingSpinner, Button } from "hds-react";

import { PageInfo } from "../../types";
import useA11yPagination from "../../hooks/usePagination";
import Text from "../../components/text/Text";
import List from "../../components/list/List";
import styles from "./paginationContainer.module.scss";

const a11yListItemFactory =
  ({ a11yIndex, ref, loadedMoreAmount, loading }) =>
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
              loading ? "Ladataan lisää" : `${loadedMoreAmount} sijaintia lisää`
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
  fetchMore: any;
  pageInfo: PageInfo;
  loading: boolean;
  elements: React.ReactElement[];
  totalCount: number;
  pageSize: number;
  showNoMoreItemsToLoadNotice?: boolean;
};

export default function PaginationContainer({
  fetchMore: originalFetchMore,
  pageInfo,
  loading,
  elements,
  totalCount,
  pageSize,
  showNoMoreItemsToLoadNotice = false,
}: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const { fetchMore, loadedMoreAmount, a11yIndex, resultsLeft } =
    useA11yPagination({
      moreResultsAnnouncerRef: ref,
      fetchMore: originalFetchMore,
      hasNextPage: pageInfo.hasNextPage,
      visibleCount: elements.length,
      count: pageInfo.count,
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

  const Li = a11yListItemFactory({ a11yIndex, ref, loadedMoreAmount, loading });
  const hasNextPage = pageInfo?.hasNextPage;

  return (
    <>
      <List variant="grid-2" items={elements} li={Li} />
      <LoadingSpinner hidden={!loading} className={styles.spinner} />
      {!loading && (
        <>
          {hasNextPage ? (
            <Button onClick={handleLoadMore} className={styles.loadMore}>
              Näytä lisää ({resultsLeft})
            </Button>
          ) : (
            showNoMoreItemsToLoadNotice && (
              <Text variant="body">Ei enempää hakutuloksia</Text>
            )
          )}
        </>
      )}
    </>
  );
}
