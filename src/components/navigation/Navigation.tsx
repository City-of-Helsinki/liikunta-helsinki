import { Navigation as HDSNavigation, IconSignout } from "hds-react";

import styles from "./navigation.module.scss";

type Props = {
  mainContentId: string;
};

function Navigation({ mainContentId }: Props) {
  return (
    <HDSNavigation
      className={styles.Navigation}
      title="Liikunta Helsinki"
      menuToggleAriaLabel="menu"
      skipTo={`#${mainContentId}`}
      skipToContentLabel="Siirry suoraan sisältöön"
    >
      <HDSNavigation.Row variant="inline">
        <HDSNavigation.Item label="Haku" active />
        <HDSNavigation.Item label="Liikuntapaikat" />
        <HDSNavigation.Item label="Liikuntatunnit" />
        <HDSNavigation.Item label="Ryhmät" />
        <HDSNavigation.Actions>
          <HDSNavigation.User
            authenticated={true}
            buttonAriaLabel=""
            label=""
            onSignIn={() => {}}
            userName="Liza Liikkuja"
          >
            <HDSNavigation.Item
              as="a"
              href="#"
              label="Link"
              onClick={() => {}}
              variant="secondary"
            />
            <HDSNavigation.Item
              as="a"
              href="#"
              icon={<IconSignout aria-hidden />}
              label="Sign out"
              onClick={() => {}}
              variant="supplementary"
            />
          </HDSNavigation.User>
          <HDSNavigation.LanguageSelector label="FI">
            <HDSNavigation.Item
              as="a"
              href="#"
              label="Suomeksi"
              onClick={() => {}}
            />
            <HDSNavigation.Item
              as="a"
              href="#"
              label="På svenska"
              onClick={() => {}}
            />
            <HDSNavigation.Item
              as="a"
              href="#"
              label="In English"
              onClick={() => {}}
            />
          </HDSNavigation.LanguageSelector>
        </HDSNavigation.Actions>
      </HDSNavigation.Row>
    </HDSNavigation>
  );
}

export default Navigation;
