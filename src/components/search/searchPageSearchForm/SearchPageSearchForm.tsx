import {
  Tag,
  Button,
  TextInput,
  Select,
  Checkbox,
  IconSearch,
} from "hds-react";

import Text from "../../text/Text";
import styles from "./searchPageSearchForm.module.scss";

function SearchPageSearchForm() {
  const mockCategory = [
    {
      label: "Maauimalat ja uimarannat",
      value: "swimswim",
    },
  ];

  const mockSportTypes = [
    {
      label: "Uinti",
      value: "uinti",
    },
    {
      label: "Lenkkeily",
      value: "lenkkeily",
    },
  ];

  const mockArea = [
    {
      label: "Helsinki",
      value: "helsinki",
    },
    {
      label: "Espoo",
      value: "espoo",
    },
    {
      label: "Vantaa",
      value: "vantaa",
    },
  ];

  const mockPrice = [
    {
      label: "Ilmainen",
      value: "ilmainen",
    },
    {
      label: "Maksullinen",
      value: "maksullinen",
    },
  ];

  return (
    <div className={styles.searchArea}>
      <Text variant="h1">Mitä etsit?</Text>
      <form role="search" className={styles.form}>
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
          multiselect
          id="place"
          placeholder="Valitse paikka"
          options={mockCategory}
          clearable={false}
          clearButtonAriaLabel="asd"
          selectedItemRemoveButtonAriaLabel="Remove element {value}"
          selectedItemSrLabel="Selected element {value}"
          getA11yRemovalMessage={({ removedSelectedItem }) =>
            `${removedSelectedItem.label} was removed`
          }
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
