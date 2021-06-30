import React, { Ref, forwardRef } from "react";
import classNames from "classnames";
import { Button, LoadingSpinner, IconMap } from "hds-react";
import { useRouter } from "next/router";

import styles from "./searchList.module.scss";
import Text from "../text/Text";

type Props = {
  items: React.ReactElement[];
  onLoadMore: () => void;
  hasNext: boolean;
  loading: boolean;
  count: number;
  blockSize: number;
};

const SearchList = forwardRef(
  (
    { loading, hasNext, count, onLoadMore, items, blockSize }: Props,
    ref: Ref<HTMLLIElement>
  ) => {
    const router = useRouter();
    const resultsLeft = count ? count - items.length : 0;
    const a11yIndex = (Math.floor(items.length / blockSize) - 1) * blockSize;
    const loadedMoreAmount = hasNext ? blockSize : count - items.length;

    const showOnMap = () => {
      router.push("/search/?show=map");
    };

    return (
      <>
        {!loading && (
          <div className={styles.row}>
            <Button onClick={showOnMap} iconLeft={<IconMap />}>
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

export default SearchList;
