import { Button, TextInput, IconSearch } from "hds-react";
import React, { useState } from "react";
import { useRouter } from "next/dist/client/router";

import Text from "../../text/Text";
import styles from "./searchPageSearchForm.module.scss";

function SearchPageSearchForm() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({ query: searchText ? { q: searchText } : "" }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className={styles.searchArea}>
      <Text variant="h1">Mitä etsit?</Text>
      <form role="search" className={styles.form} onSubmit={handleSubmit}>
        <TextInput
          label="Haku"
          hideLabel
          placeholder="Kirjoita hakusana, esim. uimahalli tai jooga"
          id="text"
          name="text"
          className={styles.inputWithIcon}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        >
          <IconSearch aria-hidden="true" />
        </TextInput>
        <Button type="submit">Hae</Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
