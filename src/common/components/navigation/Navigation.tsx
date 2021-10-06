import { UrlObject } from "url";

import React from "react";
import { Navigation as HDSNavigation } from "hds-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

import { Locale } from "../../../config";
import I18nLink from "../../../domain/i18n/router/Link";
import useRouter from "../../../domain/i18n/router/useRouter";
import { Language, NavigationItem } from "../../../types";
import styles from "./navigation.module.scss";

function persistLanguageChoice(language: string) {
  document.cookie = `NEXT_LOCALE=${language}; SameSite=Strict`;
}

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  href: string | UrlObject;
  locale?: React.ComponentProps<typeof I18nLink>["locale"];
  lang?: string;
  children?: React.ReactNode;
};

const Link = ({ href, children, locale, ...rest }: LinkProps) => {
  return (
    <I18nLink href={href} locale={locale} avoidEscaping>
      <a {...rest}>{children}</a>
    </I18nLink>
  );
};

type Props = {
  mainContentId: string;
  navigationItems: NavigationItem[];
  languages: Language[];
  variant?: "default" | "white";
};

function Navigation({
  mainContentId,
  navigationItems,
  languages,
  variant = "default",
}: Props) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("navigation");
  const { locale, push, route, query } = useRouter();

  const handleLanguageClick = (event) => {
    const lang = event.target.lang;

    persistLanguageChoice(lang);
  };

  return (
    <HDSNavigation
      className={classNames(styles.navigation, {
        [styles.default]: variant === "default",
      })}
      title={tCommon("site_name")}
      menuToggleAriaLabel={t("menu_toggle_aria_label")}
      skipTo={`#${mainContentId}`}
      skipToContentLabel={t("skip_to_content_label")}
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
              locale={language.slug as Locale}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              href={{
                pathname: route,
                query,
              }}
              onClick={handleLanguageClick}
            />
          ))}
        </HDSNavigation.LanguageSelector>
      </HDSNavigation.Actions>
    </HDSNavigation>
  );
}

export default Navigation;
