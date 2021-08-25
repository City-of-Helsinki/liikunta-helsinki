import React, { useState } from "react";
import { TextInput, Button, IconSearch } from "hds-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

import useSetUnifiedSearchParams from "../../../domain/unifiedSearch/useSetUnifiedSearchParams";
import Link from "../../../domain/i18n/router/Link";
import Text from "../../text/Text";
import SecondaryLink from "../../link/SecondaryLink";
import styles from "./landingPageSearchForm.module.scss";

function LandingPageSearchForm() {
  const { t } = useTranslation("landing_page_search_form");
  const { setUnifiedSearchParams } = useSetUnifiedSearchParams();
  const [searchText, setSearchText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnifiedSearchParams({ q: searchText });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <form role="search" className={styles.searchForm} onSubmit={handleSubmit}>
      <Text as="h2" variant="h3" className={styles.title}>
        {t("title")}
      </Text>
      <TextInput
        className={classNames(
          styles.inputWithIcon,
          styles.hdsTextInputOverrides
        )}
        name="q"
        id="q"
        label={t("free_text_search.label")}
        placeholder={t("free_text_search.placeholder")}
        onChange={handleChange}
        value={searchText}
      >
        <IconSearch aria-hidden="true" />
      </TextInput>
      <Button
        type="submit"
        iconLeft={<IconSearch />}
        className={styles.hdsButtonOverrides}
      >
        {t("do_search")}
      </Button>
      <Link href="/search" passHref>
        <SecondaryLink>{t("go_to_advanced_search")}</SecondaryLink>
      </Link>
    </form>
  );
}

export default LandingPageSearchForm;
