import React, { Ref, forwardRef } from "react";
import classNames from "classnames";
import { Button, LoadingSpinner, IconMap, IconSearch } from "hds-react";

import styles from "./searchList.module.scss";
import Text from "../text/Text";
import InfoTemplate from "../infoTemplate/InfoTemplate";

type Props = {
  items: React.ReactElement[];
  onLoadMore: () => void;
  hasNext: boolean;
  loading: boolean;
  count: number;
  blockSize: number;
  switchShowMode: () => void;
};

const SearchList = forwardRef(
  (
    {
      loading,
      hasNext,
      count,
      onLoadMore,
      items,
      blockSize,
      switchShowMode,
    }: Props,
    ref: Ref<HTMLLIElement>
  ) => {
    const resultsLeft = count ? count - items.length : 0;
    const a11yIndex = (Math.floor(items.length / blockSize) - 1) * blockSize;
    const loadedMoreAmount = hasNext ? blockSize : count - items.length;

    if (count === 0) {
      return (
        <InfoTemplate
          icon={IconSearch}
          title="Sorry no search results were found for the search criteria you selected"
          description="Try changing your search criteria and you're sure to find something to do!"
        />
      );
    }

    return (
      <>
        {!loading && (
          <div className={styles.row}>
            <Button
              onClick={switchShowMode}
              iconLeft={<IconMap />}
              className={styles.showOnMap}
            >
              Näytä kartalla
            </Button>
            <Text variant="h2" className={styles.resultCount} role="status">
              {count} hakutulosta
            </Text>
          </div>
        )}
        <ul className={classNames(styles.list, styles.searchResult)}>
          {items.map((node: React.ReactElement, index: number) => (
            <React.Fragment key={node.key}>
              {a11yIndex > 0 && a11yIndex === index && (
                <li
                  className={styles.loadMoreAnnouncer}
                  tabIndex={-1}
                  ref={ref}
                  aria-label={
                    loading
                      ? "Ladataan lisää"
                      : `${loadedMoreAmount} sijaintia lisää`
                  }
                />
              )}
              <li className={styles.item}>{node}</li>
            </React.Fragment>
          ))}
        </ul>
        <LoadingSpinner hidden={!loading} className={styles.spinner} />
        {!loading && (
          <>
            {hasNext ? (
              <Button onClick={onLoadMore} className={styles.loadMore}>
                Näytä lisää sijainteja ({resultsLeft})
              </Button>
            ) : (
              <Text variant="body">Ei enempää hakutuloksia</Text>
            )}
          </>
        )}
      </>
    );
  }
);

SearchList.displayName = "SearchList";

export default SearchList;
