import React from "react";
import { Footer as HDSFooter, LogoLanguage } from "hds-react";
import { useTranslation } from "next-i18next";

import { NavigationItem } from "../../../types";
import useRouter from "../../../domain/i18n/router/useRouter";
import NextLink from "../../../domain/i18n/router/Link";
import BaseLink from "../link/Link";
import styles from "./footer.module.scss";

type LinkProps = Omit<React.HTMLProps<HTMLAnchorElement>, "ref" | "size"> & {
  locale?: React.ComponentProps<typeof NextLink>["locale"];
  lang?: string;
  external?: boolean;
  children?: string;
};

const Link = ({ href, children, locale, ...rest }: LinkProps) => {
  return (
    <NextLink href={href} locale={locale} passHref>
      <BaseLink {...rest} disableVisitedStyles>
        {children}
      </BaseLink>
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

  return (
    <HDSFooter
      title={tCommon("site_name")}
      className={styles.footer}
      logoLanguage={logoLanguage}
    >
      <HDSFooter.Navigation variant="minimal">
        <HDSFooter.Item
          href="https://www.hel.fi/helsinki/fi/kaupunki-ja-hallinto/osallistu-ja-vaikuta/palaute"
          label={t("feedback")}
          as={Link}
        />
        {navigationItems.map((navigationItem) => (
          <HDSFooter.Item
            key={navigationItem.id}
            as={Link}
            label={navigationItem.label}
            title={navigationItem.title}
            href={navigationItem.url}
          />
        ))}
        <HDSFooter.Item href="/about" label={t("about_us")} as={Link} />
        <HDSFooter.Item
          href="/accessibility"
          label={t("accessibility_statement")}
          as={Link}
        />
      </HDSFooter.Navigation>
      <HDSFooter.Base
        copyrightHolder={t("copyright_holder")}
        copyrightText={t("copyright_text")}
      ></HDSFooter.Base>
    </HDSFooter>
  );
}

export default Footer;
