import React from "react";
import { Button } from "hds-react";

import { Item } from "../../types";
import Card from "./Card";
import styles from "./searchResultCard.module.scss";

function SearchResultCard({ id, title, keywords, href, image }: Item) {
  return (
    <Card id={id} className={styles.searchResultCard}>
      <Card.Content>
        <Card.Title title={title} as="h2" variant="h3" href={href} />
      </Card.Content>
      <Button className={styles.button}>Lue lisää</Button>
      <Card.Keywords keywords={keywords} className={styles.keywords} />
      <Card.Image image={image} />
    </Card>
  );
}

export default SearchResultCard;
