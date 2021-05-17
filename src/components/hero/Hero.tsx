import { Koros } from "hds-react";
import Link from "next/link";

import Text from "../text/Text";
import { LandingPage } from "../../types";
import styles from "./hero.module.scss";

function Hero({ title, link, desktopImage }: LandingPage) {
  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${desktopImage.uri})` }}
    >
      <div className={styles.box}>
        <Text variant="body" className={styles.boxHelper}>
          Kokosimme yhteen
        </Text>
        <Text variant="h1" className={styles.boxTitle}>
          {title}
        </Text>
        <Link href={link} passHref>
          <a href={link} className={styles.link}>
            Katso vinkit
          </a>
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
