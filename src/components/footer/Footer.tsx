import { Footer as HDSFooter, LogoLanguage } from "hds-react";
import React from "react";
import { useRouter } from "next/dist/client/router";
import NextLink from "next/link";

import { NavigationItem } from "../../types";
import mockCategories from "../../api/tmp/mockCategories";
import SearchShortcuts from "../../components/searchShortcuts/SearchShortcuts";
import styles from "./footer.module.scss";

type LinkProps = {
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
  navigationItems: NavigationItem[];
};

function Footer({ navigationItems }: Props) {
  const { locale } = useRouter();
  const logoLanguage: LogoLanguage = locale === "sv" ? "sv" : "fi";
  const categories = mockCategories;

  return (
    <HDSFooter
      title="Liikunta"
      className={styles.footer}
      logoLanguage={logoLanguage}
    >
      <div className={styles.searchShortcuts}>
        <hr className={styles.hr} aria-hidden="true" />
        <SearchShortcuts
          shortcuts={categories.map((category, i) => ({
            id: i.toString(),
            label: category.label,
            icon: category.icon,
          }))}
        />
      </div>
      <HDSFooter.Navigation>
        {navigationItems.map((navigationItem) => (
          <HDSFooter.Item
            key={navigationItem.id}
            as={Link}
            label={navigationItem.title}
            href={navigationItem.url}
          />
        ))}
      </HDSFooter.Navigation>
      <HDSFooter.Utilities backToTopLabel="Takaisin alkuun">
        <HDSFooter.Item
          className={styles.FooterUtilities}
          href="#"
          label="Anna palautetta"
        />
      </HDSFooter.Utilities>
      <HDSFooter.Base
        copyrightHolder="Copyright"
        copyrightText="Kaikki oikeudet pidätetään"
      >
        <HDSFooter.Item href="#" label="Tietoa palvelusta" />
        <HDSFooter.Item href="#" label="Saavutettavuusseloste" />
      </HDSFooter.Base>
    </HDSFooter>
  );
}

export default Footer;
