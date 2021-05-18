import { TextInput, DateInput, Button, IconSearch } from "hds-react";
import Link from "next/link";

import Text from "../../text/Text";
import SecondaryLink from "../../link/SecondaryLink";
import styles from "./landingPageSearchForm.module.scss";

function LandingPageSearchForm() {
  return (
    <form role="search" className={styles.searchForm}>
      <Text as="h2" variant="h3">
        Löydä liikuntaa
      </Text>
      <TextInput
        name="q"
        id="q"
        label="Mitä etsit?"
        placeholder="Aloita kirjoittamalla tähän, esim. uimahalli tai jooga"
      />
      <DateInput
        id="date"
        initialMonth={new Date()}
        label="Mille ajankohdalle etsit?"
        language="fi"
        required
      />
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
