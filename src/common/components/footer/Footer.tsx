import { Footer as HDSFooter, IconLinkExternal, LogoLanguage } from "hds-react";
import React from "react";
import { useTranslation } from "next-i18next";

import useRouter from "../../../domain/i18n/router/useRouter";
import { NavigationItem } from "../../../types";
import NextLink from "../../../domain/i18n/router/Link";
import styles from "./footer.module.scss";

type LinkProps = React.HTMLProps<HTMLAnchorElement> & {
  locale?: React.ComponentProps<typeof NextLink>["locale"];
  lang?: string;
  external?: boolean;
  children?: React.ReactNode;
};

const Link = ({
  href,
  children,
  locale,
  external = false,
  ...rest
}: LinkProps) => {
  const { t } = useTranslation();
  return (
    <NextLink href={href} locale={locale}>
      <a {...rest}>
        {children}
        {external && <IconLinkExternal aria-label={t("opens_in_new_tab")} />}
      </a>
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
          label="Anna palautetta"
          external
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
