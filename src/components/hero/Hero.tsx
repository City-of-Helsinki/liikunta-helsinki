import { Koros } from "hds-react";
import Link from "next/link";

import Text from "../text/Text";
import styles from "./hero.module.scss";

type Props = {
  title: string;
  description: string;
  desktopImageUri: string;
  cta: {
    label: string;
    href: string;
  };
};

function Hero({ title, description, desktopImageUri, cta }: Props) {
  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${desktopImageUri})` }}
    >
      <div className={styles.box}>
        <Text variant="body" className={styles.boxHelper}>
          {description}
        </Text>
        <Text variant="h1" className={styles.boxTitle}>
          {title}
        </Text>
        <Link href={cta.href}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a className={styles.linkButton}>{cta.label}</a>
        </Link>
      </div>
      <div className={styles.korosBlock}>
        <Koros className={styles.koros} />
        <div className={styles.block} />
      </div>
    </div>
  );
}

export default Hero;
