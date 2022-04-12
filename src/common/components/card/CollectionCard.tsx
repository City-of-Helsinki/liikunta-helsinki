import React from "react";

import { Item } from "../../../types";
import formatToSingleTag from "../../utils/formatToSingleTag";
import Card from "./Card";
import styles from "./collectionCard.module.scss";

function CollectionCard({ id, title, infoLines, keywords, href, image }: Item) {
  return (
    <Card id={id}>
      <Card.Content>
        <Card.Title variant="h3" title={title} href={href} />
        <Card.ClampedCardInfoLines
          variant="body-l"
          infoLines={[
            formatToSingleTag(
              infoLines
                .map((line) => (typeof line === "string" ? line : line.text))
                .join()
            ),
          ]}
        />
      </Card.Content>
      <Card.Cta />
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.NonOptimizedImage image={image} />
    </Card>
  );
}

export default CollectionCard;
