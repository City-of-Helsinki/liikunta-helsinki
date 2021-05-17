import Link from "next/link";
import React from "react";
import { IconAngleRight } from "hds-react";

import Text from "../text/Text";
import styles from "./section.module.scss";

type Props = {
  title?: string;
  children: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
};

function Section({ title, children, cta }: Props) {
  const titleComponent = <Text variant="h2">{title}</Text>;

  return (
    <section className={styles.section}>
      {!cta && title && titleComponent}
      {cta && title && (
        <header className={styles.sectionHeader}>
          {titleComponent}
          <Link href={cta.href}>
            {/* <Link /> applies href */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              {cta.label} <IconAngleRight size="s" />
            </a>
          </Link>
        </header>
      )}
      {children}
    </section>
  );
}

export default Section;
