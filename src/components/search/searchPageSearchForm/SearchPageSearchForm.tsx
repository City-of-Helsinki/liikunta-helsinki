import {
  Tag,
  Button,
  TextInput,
  Select,
  Checkbox,
  IconSearch,
} from "hds-react";

import Text from "../../text/Text";
import {
  mockSportTypes,
  mockArea,
  mockPrice,
  mockCategory,
} from "./tmp/mockedData";
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
          placeholder="Kirjoita hakusana, esim. uimahalli tai jooga"
          id="text"
          name="text"
          className={styles.inputWithIcon}
        >
          <IconSearch aria-hidden="true" />
        </TextInput>
        <Select
          label=""
          id="place"
          placeholder="Valitse paikka"
          options={mockCategory}
        />
        <Select
          label=""
          id="sport"
          placeholder="Valitse liikuntamuoto/laji"
          options={mockSportTypes}
        />
        <Select label="" placeholder="Valitse alue" options={mockArea} />
        <Select label="" placeholder="Valitse hinta" options={mockPrice} />

        <Checkbox id="Box " label="Sopiva liikuntarajoitteisille" />
        <Checkbox id="Box " label="Lähimmät paikat ensin" />
        <Checkbox id="Box " label="Näytä vain ilmaiset" />
        <Checkbox id="Box " label="Avoinna nyt" />
        <div>
          <Tag>Test</Tag>
        </div>
        <Button type="submit">Hae</Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
