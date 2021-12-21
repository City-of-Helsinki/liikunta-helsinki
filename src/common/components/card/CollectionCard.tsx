import React from "react";

import { Item } from "../../../types";
import Card from "./Card";
import styles from "./collectionCard.module.scss";

function CollectionCard({ id, title, infoLines, keywords, href, image }: Item) {
  return (
    <Card id={id}>
      <Card.Content>
        <Card.Title variant="h3" title={title} href={href} />
        <Card.InfoLines infoLines={infoLines} />
      </Card.Content>
      <Card.Cta />
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.NonOptimizedImage image={image} />
    </Card>
  );
}

export default CollectionCard;
