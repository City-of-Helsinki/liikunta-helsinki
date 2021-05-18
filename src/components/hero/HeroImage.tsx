import { Koros } from "hds-react";

import styles from "./heroImage.module.scss";

type Props = {
  desktopImageUri: string;
  withDecoration?: boolean;
};

function HeroImage({ desktopImageUri, withDecoration = true }: Props) {
  return (
    <div className={styles.heroImage}>
      <span
        className={styles.image}
        style={{ backgroundImage: `url(${desktopImageUri})` }}
      />
      {withDecoration && <Koros />}
    </div>
  );
}

export default HeroImage;
