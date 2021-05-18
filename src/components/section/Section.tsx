import Link from "next/link";
import React from "react";
import classNames from "classnames";

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
};

function Section({
  title,
  children,
  cta,
  color = "grey",
  variant = "default",
}: Props) {
  const titleComponent = <Text variant="h2">{title}</Text>;

  return (
    <section
      className={classNames(styles.section, styles[color], styles[variant])}
    >
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
