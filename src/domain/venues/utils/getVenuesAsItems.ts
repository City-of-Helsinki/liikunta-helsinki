import { Item } from "../../../types";

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
  pictureUrl: string;
  pictureCaption: string;
  description: string;
  ontologyWords: Array<{
    id: string;
    label: string;
  }>;
};

export default function getVenuesAsItems(venues: Venue[] | undefined): Item[] {
  if (!venues) {
    return [];
  }

  return venues.map(({ id, name, description, pictureUrl, ontologyWords }) => ({
    id,
    title: name,
    infoLines: [limitWordCount(description)],
    href: `/venues/tprek:${id}`,
    image: pictureUrl,
    keywords: ontologyWords.map((ontology) => ({
      label: ontology.label,
      href: {
        query: {
          ontologyWordIds: [ontology.id],
        },
      },
    })),
  }));
}
