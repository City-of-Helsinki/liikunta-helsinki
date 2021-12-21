import React from "react";
import { useTranslation } from "react-i18next";

import { Item } from "../../../types";
import Card from "./Card";
import styles from "./condensedCard.module.scss";

function CondensedCard({
  id,
  title,
  infoLines,
  keywords,
  pre,
  href,
  image,
}: Item) {
  const { t } = useTranslation("card");

  return (
    <Card id={id}>
      <Card.Content className={styles.content}>
        <Card.Title title={title} href={href} as="h3" variant="h3" />
        <Card.Pre className={styles.pre}>{pre}</Card.Pre>
        <div className={styles.row}>
          <Card.InfoLines className={styles.infoLines} infoLines={infoLines} />
          <Card.CtaButton variant="s" className={styles.cta}>
            {t("read_more")}
          </Card.CtaButton>
        </div>
      </Card.Content>
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.Image image={image} />
    </Card>
  );
}

export default CondensedCard;
