import { HTMLAttributes } from "react";

import { ItemInfoLineObject } from "../../types";

type SupportedTags = "p";

export default function formatToSingleTag(
  text: (string | ItemInfoLineObject)[],
  as?: SupportedTags
): (string | ItemInfoLineObject)[] {
  if (typeof text[0] === "string") {
    return [
      `<${as}>${text[0]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()}</${as}>`,
    ];
  } else {
    return text;
  }
}
