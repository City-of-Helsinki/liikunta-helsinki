import React from "react";

import InfoBlock from "../infoBlock/InfoBlock";
import { Item } from "../../../types";
import Card from "./Card";
import styles from "./searchResultCard.module.scss";

type Props = {
  item: Item;
  infoBlocks?: React.ReactElement<React.ComponentProps<typeof InfoBlock>>[];
  ctaLabel: string;
};

function SearchResultCard({
  item: { id, title, keywords, href, image },
  infoBlocks,
  ctaLabel,
}: Props) {
  return (
    <Card id={id} className={styles.searchResultCard}>
      <Card.Content className={styles.content}>
        <Card.Title title={title} as="h2" variant="h3" href={href} />
        {infoBlocks && (
          <ul className={styles.infoBlocks}>
            {infoBlocks.map((infoBlock) => (
              <li key={infoBlock.key}>{infoBlock}</li>
            ))}
          </ul>
        )}
      </Card.Content>
      <Card.CtaButton className={styles.button}>{ctaLabel}</Card.CtaButton>
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.Image image={image} />
    </Card>
  );
}

export default SearchResultCard;
