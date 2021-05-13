import React from "react";

import { Item } from "../../types";
import Card from "./Card";

function DefaultCard({
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
      <Card.Content>
        <Card.Title title={title} href={href} />
        <Card.Pre>{pre}</Card.Pre>
        <Card.InfoLines infoLines={infoLines} />
      </Card.Content>
      <Card.Cta />
      <Card.Keywords keywords={keywords} />
      <Card.Image image={image} />
    </Card>
  );
}

export default DefaultCard;
