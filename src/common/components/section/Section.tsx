import React from "react";
import classNames from "classnames";
import { Koros } from "hds-react";

import Link from "../../../domain/i18n/router/Link";
import Text from "../text/Text";
import SecondaryLink from "../link/SecondaryLink";
import styles from "./section.module.scss";

type Props = {
  title?: string;
  children: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
  color?: "grey" | "white" | "transparent";
  variant?: "default" | "contained";
  koros?: "none" | React.ComponentProps<typeof Koros>["type"];
  contentWidth?: "m" | "s";
  rowGap?: "normal" | "tight";
};

function Section({
  title,
  children,
  cta,
  color = "grey",
  variant = "default",
  koros = "none",
  contentWidth = "m",
  rowGap = "normal",
}: Props) {
  const titleComponent = <Text variant="h2">{title}</Text>;

  return (
    <section
      className={classNames(
        styles.section,
        styles[color],
        styles[variant],
        styles[contentWidth],
        styles[rowGap],
        {
          [styles.hasKoros]: koros !== "none",
        }
      )}
    >
      {koros !== "none" && <Koros className={styles.koros} type={koros} />}
      {!cta && title && titleComponent}
      {cta && title && (
        <header className={styles.sectionHeader}>
          {titleComponent}
          <Link href={cta.href} passHref>
            <SecondaryLink>{cta.label}</SecondaryLink>
          </Link>
        </header>
      )}
      {children}
    </section>
  );
}

export default Section;
