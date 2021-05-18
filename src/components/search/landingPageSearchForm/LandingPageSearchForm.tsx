import { TextInput, Button, IconSearch } from "hds-react";
import Link from "next/link";

import Text from "../../text/Text";
import SecondaryLink from "../../link/SecondaryLink";
import styles from "./landingPageSearchForm.module.scss";

function LandingPageSearchForm() {
  return (
    <form role="search" className={styles.searchForm}>
      <Text as="h2" variant="h3" className={styles.title}>
        Löydä liikuntaa
      </Text>
      <TextInput
        className={styles.inputWithIcon}
        name="q"
        id="q"
        label="Mitä etsit?"
        placeholder="Aloita kirjoittamalla tähän, esim. uimahalli tai jooga"
      >
        <IconSearch aria-hidden="true" />
      </TextInput>
      <Button type="submit" iconLeft={<IconSearch />}>
        Hae
      </Button>
      <Link href="/search" passHref>
        <SecondaryLink>Tarkennettu haku</SecondaryLink>
      </Link>
    </form>
  );
}

export default LandingPageSearchForm;
