import { Koros, Button } from "hds-react";
import Link from "next/link";

import { LandingPage } from "../../types";
import styles from "./hero.module.scss";

function Hero({ title, link, desktopImage }: LandingPage) {
  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${desktopImage.uri})` }}
    >
      <div className={styles.box}>
        <p>Kokosimme yhteen</p>
        <h1>{title}</h1>
        <Link href={link}>
          <Button className={styles.button}>Katso vinkit</Button>
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
