import React, { ReactElement } from "react";
import { Navigation as HDSNavigation, IconSignout } from "hds-react";
import NextLink from "next/link";

import { NavigationItem } from "../../types";
import styles from "./navigation.module.scss";

const Link = ({ href, children, ...rest }) => {
  return (
    <NextLink href={href}>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};

type Props = {
  mainContentId: string;
  navigationItems: NavigationItem[];
};

function Navigation({ mainContentId, navigationItems }: Props) {
  return (
    <HDSNavigation
      className={styles.Navigation}
      title="Liikunta Helsinki"
      menuToggleAriaLabel="menu"
      skipTo={`#${mainContentId}`}
      skipToContentLabel="Siirry suoraan sisältöön"
    >
      <HDSNavigation.Row variant="inline">
        {navigationItems.map((navigationItem) => (
          <HDSNavigation.Item
            key={navigationItem.id}
            as={Link}
            label={navigationItem.title}
            href={navigationItem.url}
          />
        ))}
      </HDSNavigation.Row>
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
    </HDSNavigation>
  );
}

export default Navigation;
