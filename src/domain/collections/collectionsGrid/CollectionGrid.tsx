import { useInView } from "react-intersection-observer";

import { Collection, Item } from "../../../types";
import List from "../../../common/components/list/List";
import LargeCollectionCard from "../../../common/components/card/LargeCollectionCard";
import CollectionCard from "../../../common/components/card/CollectionCard";
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
    keywords: [],
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
            // Only use the label count component in the browser to ensure that
            // the client it uses it ready.
            label: process.browser ? (
              <CollectionCountLabel collection={collection} defer={!inView} />
            ) : null,
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
