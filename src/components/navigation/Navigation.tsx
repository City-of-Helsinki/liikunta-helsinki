import React from "react";
import { Navigation as HDSNavigation, IconSignout } from "hds-react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Language, NavigationItem } from "../../types";
import styles from "./navigation.module.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  href: string;
  locale?: React.ComponentProps<typeof NextLink>["locale"];
  lang?: string;
  children?: React.ReactNode;
};

const Link = ({ href, children, locale, ...rest }: LinkProps) => {
  return (
    <NextLink href={href} locale={locale}>
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
  const { locale, route, push } = useRouter();

  return (
    <HDSNavigation
      className={styles.Navigation}
      title="Liikunta Helsinki"
      menuToggleAriaLabel="menu"
      skipTo={`#${mainContentId}`}
      skipToContentLabel="Siirry suoraan sisältöön"
      onTitleClick={() => push("/")}
      logoLanguage={locale === "sv" ? "sv" : "fi"}
    >
      <HDSNavigation.Row variant="inline">
        {navigationItems.map((navigationItem) => (
          <HDSNavigation.Item
            key={navigationItem.id}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            as={Link}
            label={navigationItem.label}
            title={navigationItem.title}
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              as={Link}
              label={language.name}
              lang={language.slug}
              // Target current route with another locale
              locale={language.slug}
              href={route}
            />
          ))}
        </HDSNavigation.LanguageSelector>
      </HDSNavigation.Actions>
    </HDSNavigation>
  );
}

export default Navigation;
