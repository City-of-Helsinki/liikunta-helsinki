import { useState } from "react";
import { IconCross, Button, IconSearch, IconMenuHamburger } from "hds-react";

import Text from "../../text/Text";
import SearchPageSearchForm from "../searchPageSearchForm/SearchPageSearchForm";
import styles from "./searchHeader.module.scss";

export enum ShowMode {
  MAP = "map",
  LIST = "list",
}

type Props = {
  showMode: ShowMode;
  count: number;
  refetch: (q: string) => void;
  switchShowMode: () => void;
};

function SearchHeader({ showMode, refetch, count, switchShowMode }: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const MapSearch = () => {
    return (
      <div className={styles.searchHeader}>
        {!collapsed && (
          <div className={styles.searchMenu}>
            <SearchPageSearchForm refetch={refetch} showMode={showMode} />
            <Button
              className={styles.closeSearch}
              variant="secondary"
              theme="black"
              iconLeft={<IconCross />}
              fullWidth
              onClick={() => setCollapsed(true)}
            >
              Sulje hakuehdot
            </Button>
          </div>
        )}
        <div className={styles.searchActions}>
          {collapsed && (
            <>
              <Button
                variant="supplementary"
                theme="black"
                iconLeft={<IconMenuHamburger />}
                onClick={switchShowMode}
              >
                Näytä listana
              </Button>
              <div className={styles.countAndTags}>
                <Text variant="h3">{count} hakutulosta</Text>
              </div>
              <Button
                variant="supplementary"
                theme="black"
                iconLeft={<IconSearch />}
                onClick={() => setCollapsed(false)}
              >
                Näytä haku
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  const ListSearch = () => {
    return (
      <div className={styles.searchArea}>
        <SearchPageSearchForm refetch={refetch} showMode={showMode} />
      </div>
    );
  };

  return (
    <>
      {showMode === ShowMode.MAP && <MapSearch />}
      {showMode === ShowMode.LIST && <ListSearch />}
    </>
  );
}

export default SearchHeader;
