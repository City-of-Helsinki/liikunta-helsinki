import React from "react";
import Image from "next/image";

import { Item } from "../../types";
import Card from "./Card";
import styles from "./searchResultCard.module.scss";

function SearchResultCard({ id, title, keywords, href, image }: Item) {
  return (
    <Card id={id} className={styles.searchResultCard}>
      <Card.Content>
        <Card.Title title={title} as="h2" variant="h3" href={href} />
      </Card.Content>
      <Card.CtaButton className={styles.button}>Lue lisää</Card.CtaButton>
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      {image && <Card.Image image={image} />}
      {!image && (
        <Card.Image
          className={styles.placeholderCard}
          image={<Image src="/placeholder_image_missing.png" layout="fill" />}
        />
      )}
    </Card>
  );
}

export default SearchResultCard;
