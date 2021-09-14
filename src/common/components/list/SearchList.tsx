import React, { Ref, forwardRef } from "react";
import classNames from "classnames";
import { Button, LoadingSpinner, IconMap, IconSearch } from "hds-react";
import { useTranslation } from "next-i18next";

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
  listRef: Ref<HTMLUListElement>;
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
      listRef,
    }: Props,
    ref: Ref<HTMLLIElement>
  ) => {
    const { t } = useTranslation("search_list");
    const resultsLeft = count ? count - items.length : 0;
    const a11yIndex = (Math.floor(items.length / blockSize) - 1) * blockSize;
    const loadedMoreAmount = hasNext ? blockSize : count - items.length;

    if (count === 0) {
      return (
        <InfoTemplate
          icon={IconSearch}
          title={t("no_results.title")}
          description={t("no_results.description")}
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
              {t("show_on_map")}
            </Button>
            <Text variant="h2" className={styles.resultCount} role="status">
              {count} {t("search_results_count_label")}
            </Text>
          </div>
        )}
        <ul
          ref={listRef}
          className={classNames(styles.list, styles.searchResult)}
        >
          {items.map((node: React.ReactElement, index: number) => (
            <React.Fragment key={node.key}>
              {a11yIndex > 0 && a11yIndex === index && (
                <li
                  className={styles.loadMoreAnnouncer}
                  tabIndex={-1}
                  ref={ref}
                  aria-label={
                    loading
                      ? t("is_loading_more")
                      : `${loadedMoreAmount} ${t("n_more_locations")}`
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
                {t("do_show_more_locations")} ({resultsLeft})
              </Button>
            ) : (
              <Text variant="body">{t("no_more_results")}</Text>
            )}
          </>
        )}
      </>
    );
  }
);

SearchList.displayName = "SearchList";

export default SearchList;
