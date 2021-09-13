import { Footer as HDSFooter, LogoLanguage } from "hds-react";
import React from "react";
import { useTranslation } from "next-i18next";

import useRouter from "../../domain/i18n/router/useRouter";
import { NavigationItem } from "../../types";
import mockCategories from "../../client/tmp/mockCategories";
import NextLink from "../../domain/i18n/router/Link";
import SearchShortcuts from "../../components/searchShortcuts/SearchShortcuts";
import styles from "./footer.module.scss";

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  locale?: React.ComponentProps<typeof NextLink>["locale"];
  lang?: string;
  children?: React.ReactNode;
};

const Link = ({ href, children, locale, ...rest }: LinkProps) => {
  return (
    <NextLink href={href} locale={locale} avoidEscaping>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};

type Props = {
  navigationItems: NavigationItem[];
};

function Footer({ navigationItems }: Props) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("footer");
  const { locale } = useRouter();
  const logoLanguage: LogoLanguage = locale === "sv" ? "sv" : "fi";
  const categories = mockCategories;

  return (
    <HDSFooter
      title={tCommon("site_name")}
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
            label={navigationItem.label}
            title={navigationItem.title}
            href={navigationItem.url}
          />
        ))}
      </HDSFooter.Navigation>
      <HDSFooter.Utilities backToTopLabel={t("back_to_top_label")}>
        <HDSFooter.Item
          className={styles.FooterUtilities}
          href="#"
          label={t("give_feedback")}
        />
      </HDSFooter.Utilities>
      <HDSFooter.Base
        copyrightHolder={t("copyright_holder")}
        copyrightText={t("copyright_text")}
      >
        <HDSFooter.Item href="/about" label={t("about_us")} as={Link} />
        <HDSFooter.Item
          href="/accessibility"
          label={t("accessibility_statement")}
          as={Link}
        />
      </HDSFooter.Base>
    </HDSFooter>
  );
}

export default Footer;
