import React from "react";

import { Item } from "../../../types";
import Card from "./Card";
import styles from "./largeCollectionCard.module.scss";

function LargeCollectionCard({
  id,
  title,
  infoLines,
  keywords,
  href,
  image,
}: Item) {
  return (
    <Card id={id} className={styles.largeCollectionCard}>
      <Card.Content className={styles.text}>
        <Card.Title as="h3" variant="h2" title={title} href={href} />
        <Card.InfoLines as="p" variant="body-xl" infoLines={infoLines} />
      </Card.Content>
      <Card.Cta className={styles.cta} />
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.NonOptimizedImage image={image} />
    </Card>
  );
}

export default LargeCollectionCard;
