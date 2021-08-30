import { useInView } from "react-intersection-observer";

import { Collection, Item } from "../../types";
import List from "../../components/list/List";
import LargeCollectionCard from "../../components/card/LargeCollectionCard";
import CollectionCard from "../../components/card/CollectionCard";
import CollectionCountLabel from "./CollectionCountLabel";

function getCollectionAsItem(collection?: Collection): Item {
  return {
    id: collection.id,
    title: collection.translation?.title,
    infoLines: [collection.translation?.description],
    href: {
      pathname: "/collections/[slug]",
      query: { slug: collection.translation?.slug },
    },
    keywords: [
      {
        label: <CollectionCountLabel collection={collection} />,
        href: "",
      },
    ],
    image: collection.translation?.image,
  };
}

type Props = {
  collections: Collection[];
};

export default function CollectionGrid({ collections }: Props) {
  const { ref, inView } = useInView();

  return (
    <List
      listContainerRef={ref}
      variant="collection-grid"
      items={collections.map((collection, i) => {
        const item = getCollectionAsItem(collection);
        const keywords = [
          {
            label: (
              <CollectionCountLabel collection={collection} defer={!inView} />
            ),
            href: "",
          },
        ];

        return i === 0 ? (
          <LargeCollectionCard key={item.id} {...item} keywords={keywords} />
        ) : (
          <CollectionCard key={item.id} {...item} keywords={keywords} />
        );
      })}
    />
  );
}
