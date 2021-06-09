import React from "react";

import { Item } from "../../types";
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
  return (
    <Card id={id}>
      <Card.Content className={styles.content}>
        <Card.Title title={title} href={href} as="h3" variant="h3" />
        <Card.Pre className={styles.pre}>{pre}</Card.Pre>
        <Card.InfoLines infoLines={infoLines} />
      </Card.Content>
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.Image image={image} />
    </Card>
  );
}

export default CondensedCard;
