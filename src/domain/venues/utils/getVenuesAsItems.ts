import { Item } from "../../../types";
import getVenueIdParts from "./getVenueIdParts";

function limitWordCount(description: string) {
  const limit = 30;
  const wordCount = description.split(" ");

  if (wordCount.length <= limit) {
    return description;
  }

  return `${wordCount.slice(0, limit).join(" ")}...`;
}

type Venue = {
  id: string;
  name: string;
  image: string;
  description?: string;
  ontologyWords: Array<{
    id: string;
    label: string;
  }>;
};

export default function getVenuesAsItems(venues: Venue[] | undefined): Item[] {
  if (!venues) {
    return [];
  }

  return venues.map(({ id, name, description, image, ontologyWords }) => {
    const { id: idNumber } = getVenueIdParts(id);

    return {
      id,
      title: name,
      infoLines: description ? [limitWordCount(description)] : [],
      href: `/venues/tprek:${idNumber ?? id}`,
      image,
      keywords: ontologyWords.map((ontology) => ({
        label: ontology.label,
        href: {
          query: {
            ontologyWordIds: [ontology.id],
          },
        },
      })),
    };
  });
}
