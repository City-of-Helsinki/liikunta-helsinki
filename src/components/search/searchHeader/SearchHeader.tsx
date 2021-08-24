import React, { useState } from "react";
import { IconCross, Button, IconSearch, IconMenuHamburger } from "hds-react";
import { useTranslation } from "next-i18next";

import Text from "../../text/Text";
import styles from "./searchHeader.module.scss";

export enum ShowMode {
  MAP = "map",
  LIST = "list",
}

type Props = {
  showMode: ShowMode;
  count: number;
  switchShowMode: () => void;
  searchForm: React.ReactElement;
};

function SearchHeader({ showMode, count, switchShowMode, searchForm }: Props) {
  const { t } = useTranslation("search_header");
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <>
      {showMode === ShowMode.MAP && (
        <div className={styles.searchHeader}>
          {!collapsed && (
            <div className={styles.searchMenu}>
              {searchForm}
              <Button
                className={styles.closeSearch}
                variant="secondary"
                theme="black"
                iconLeft={<IconCross />}
                fullWidth
                onClick={() => setCollapsed(true)}
              >
                {t("close_search_controls")}
              </Button>
            </div>
          )}
          <div className={styles.searchActions}>
            {collapsed && (
              <>
                <Button
                  variant="secondary"
                  theme="black"
                  iconLeft={<IconMenuHamburger />}
                  onClick={switchShowMode}
                >
                  {t("show_as_a_list")}
                </Button>
                <div className={styles.countAndTags}>
                  <Text variant="h3">
                    {count} {t("search_results_count_label")}
                  </Text>
                </div>
                <Button
                  variant="secondary"
                  theme="black"
                  iconLeft={<IconSearch />}
                  onClick={() => setCollapsed(false)}
                >
                  {t("show_search_parameters")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {showMode === ShowMode.LIST && (
        <div className={styles.searchArea}>{searchForm}</div>
      )}
    </>
  );
}

export default SearchHeader;
