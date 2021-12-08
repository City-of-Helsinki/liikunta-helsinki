import React, { Ref, forwardRef } from "react";
import classNames from "classnames";
import { Button, LoadingSpinner, IconMap, IconSearch } from "hds-react";
import { useTranslation } from "next-i18next";

import { Coordinates, Option } from "../../../types";
import useUnifiedSearch from "../../../domain/unifiedSearch/useUnifiedSearch";
import Text from "../text/Text";
import InfoTemplate from "../infoTemplate/InfoTemplate";
import styles from "./searchList.module.scss";
import Select from "../select/Select";
import SmallSpinner from "../spinners/SmallSpinner";
import useGeolocation from "../../geolocation/useGeolocation";

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
    const { modifyFilters, filters, filterList } = useUnifiedSearch();
    const geolocation = useGeolocation({ skip: true });
    const resultsLeft = count ? count - items.length : 0;

    const getLoadedMoreAmount = () => {
      const remainder = items.length % blockSize;
      if (hasNext || remainder === 0) {
        return blockSize;
      }
      return remainder;
    };

    const a11yIndex =
      items.length % blockSize === 0
        ? (Math.floor(items.length / blockSize) - 1) * blockSize
        : items.length - getLoadedMoreAmount();

    if (count === 0) {
      return (
        <InfoTemplate
          icon={IconSearch}
          title={t("no_results.title")}
          description={t("no_results.description")}
        />
      );
    }

    const handleOrderChange = async (option: Option) => {
      const transitionOptions = {
        shallow: true,
      };

      switch (option.value) {
        case "distance-asc":
          let location: Coordinates | void = geolocation.coordinates;

          if (!geolocation.called || !geolocation.coordinates) {
            // Wait until position is resolved. This defers querying search
            // results until location is resolved, which will result in less UI
            // states and a slightly better UX.
            location = await geolocation.resolve();
          }

          if (location) {
            return modifyFilters(
              {
                orderBy: "distance",
                orderDir: "asc",
              },
              transitionOptions
            );
          }

        default:
          return modifyFilters(
            {
              orderBy: null,
              orderDir: null,
            },
            transitionOptions
          );
      }
    };

    const orderByOptions = [
      {
        label:
          filterList.length > 0
            ? t("order_by.relevance")
            : t("order_by.alphabetical"),
        value: "",
      },
      { label: t("order_by.distance"), value: "distance-asc" },
    ];
    const selectedOrderByOption = orderByOptions.find((option) => {
      const selectedOptionValue =
        filters.orderBy && filters.orderDir
          ? `${filters.orderBy}-${filters.orderDir}`
          : "";

      return option.value === selectedOptionValue;
    });

    return (
      <>
        {!loading && (
          <div className={styles.row}>
            <Button
              onClick={switchShowMode}
              iconLeft={<IconMap aria-hidden="true" />}
              className={styles.showOnMap}
            >
              {t("show_on_map")}
            </Button>
            <div className={styles.rowGroup}>
              <Text variant="h2" className={styles.resultCount} role="status">
                {count} {t("search_results_count_label")}
              </Text>
              <Select
                label={t("order_by.label")}
                value={selectedOrderByOption}
                onChange={handleOrderChange}
                options={orderByOptions}
                icon={geolocation.loading ? <SmallSpinner /> : null}
                noOutline
                className={styles.orderbySelect}
              />
            </div>
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
                      : `${getLoadedMoreAmount()} ${t("n_more_locations")}`
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
