import React, { useState } from "react";
import { TextInput, Button, IconSearch } from "hds-react";
import classNames from "classnames";

import useSearch from "../../../hooks/useSearch";
import Link from "../../../domain/i18n/router/Link";
import Text from "../../text/Text";
import SecondaryLink from "../../link/SecondaryLink";
import styles from "./landingPageSearchForm.module.scss";

function LandingPageSearchForm() {
  const { search } = useSearch();
  const [searchText, setSearchText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchText ? { q: searchText } : "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <form role="search" className={styles.searchForm} onSubmit={handleSubmit}>
      <Text as="h2" variant="h3" className={styles.title}>
        Löydä liikuntaa
      </Text>
      <TextInput
        className={classNames(
          styles.inputWithIcon,
          styles.hdsTextInputOverrides
        )}
        name="q"
        id="q"
        label="Mitä etsit?"
        placeholder="Aloita kirjoittamalla tähän, esim. uimahalli tai jooga"
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
        Hae
      </Button>
      <Link href="/search" passHref>
        <SecondaryLink>Tarkennettu haku</SecondaryLink>
      </Link>
    </form>
  );
}

export default LandingPageSearchForm;
