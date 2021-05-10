import React from "react";
import { Navigation as HDSNavigation, IconSignout } from "hds-react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Language, NavigationItem } from "../../types";
import styles from "./navigation.module.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

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
  languages: Language[];
};

function Navigation({ mainContentId, navigationItems, languages }: Props) {
  const { locale } = useRouter();

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
          onSignIn={noop}
          userName="Liza Liikkuja"
        >
          <HDSNavigation.Item
            as="a"
            href="#"
            label="Link"
            onClick={noop}
            variant="secondary"
          />
          <HDSNavigation.Item
            as="a"
            href="#"
            icon={<IconSignout aria-hidden />}
            label="Sign out"
            onClick={noop}
            variant="supplementary"
          />
        </HDSNavigation.User>
        <HDSNavigation.LanguageSelector label={locale.toUpperCase()}>
          {languages.map((language) => (
            <HDSNavigation.Item
              key={language.id}
              as="a"
              href="#"
              label={language.name}
              lang={language.slug}
              onClick={noop}
            />
          ))}
        </HDSNavigation.LanguageSelector>
      </HDSNavigation.Actions>
    </HDSNavigation>
  );
}

export default Navigation;
