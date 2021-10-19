import React, { useRef, useState } from "react";
import { IconCross, Button, IconSearch, IconMenuHamburger } from "hds-react";
import { useTranslation } from "next-i18next";

import Text from "../../../common/components/text/Text";
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
  const formWrapper = useRef<HTMLDivElement>();

  return (
    <>
      {showMode === ShowMode.MAP && (
        <div ref={formWrapper} className={styles.searchHeader}>
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
                  onClick={() => {
                    setCollapsed(false);

                    // This button comes after the actual form in the DOM order.
                    // It's rendered out of the UI as the state changes to
                    // !collapsed, but the focus is re-applied to elements that
                    // come after the form elements.
                    //
                    // This makes the UX cumbersome when using a keyboard or a
                    // screen reader. In order to improve the UX, we are moving
                    // the focus to the beginning of the form when the user
                    // opens it.
                    //
                    // Wait for form to be rendered into the DOM
                    setTimeout(() => {
                      const firstFormInput = formWrapper.current?.querySelector(
                        "form input"
                      ) as HTMLInputElement | null | undefined;

                      // And focus the first input on it
                      firstFormInput?.focus();
                    }, 0);
                  }}
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
