import { Button, TextInput, IconSearch } from "hds-react";

import Text from "../../text/Text";
import styles from "./searchPageSearchForm.module.scss";

function SearchPageSearchForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
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
        >
          <IconSearch aria-hidden="true" />
        </TextInput>
        <Button type="submit">Hae</Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
