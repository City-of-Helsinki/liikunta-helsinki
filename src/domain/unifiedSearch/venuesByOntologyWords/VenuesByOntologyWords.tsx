import { LoadingSpinner, IconLocation } from "hds-react";

import { Item } from "../../../types";
import { Locale } from "../../../config";
import List from "../../../common/components/list/List";
import Card from "../../../common/components/card/DefaultCard";
import capitalize from "../../../common/utils/capitalize";
import getTranslation from "../../../common/utils/getTranslation";
import useRouter from "../../i18n/router/useRouter";
import useUnifiedSearchListQuery, {
  ListVenue,
} from "../useUnifiedSearchListQuery";

function getVenuesAsItem(venues: ListVenue[], locale: Locale): Item[] {
  return venues.map((venue) => {
    const infoLines = [
      {
        icon: <IconLocation />,
        text: [
          getTranslation(venue.location?.address?.streetAddress, locale),
          getTranslation(venue.location?.address.city, locale),
          venue.location?.address.postalCode,
        ].join(", "),
      },
    ];
    const keywords = venue.ontologyWords.map((ontologyWord) => ({
      label: capitalize(getTranslation(ontologyWord.label, locale)),
      href: {
        pathname: "/search",
        query: {
          ontologyWord: ontologyWord.id,
        },
      },
    }));

    return {
      id: venue.meta.id,
      title: getTranslation(venue.name, locale),
      infoLines,
      // Limit the amount of keywords to 8 as some places may have too many
      keywords: keywords.slice(0, 7),
      href: {
        pathname: "/venues/[id]",
        query: {
          id: `tprek:${venue.meta.id}`,
        },
      },
      image: venue.images?.[0].url,
    };
  });
}

type Props = {
  ontologyWordIds: string[];
};

export default function VenuesWithOntologies({ ontologyWordIds = [] }: Props) {
  const { locale } = useRouter();
  const { data, loading } = useUnifiedSearchListQuery({
    variables: {
      ontologyWordIds,
      first: 4,
      orderByName: undefined,
    },
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  const venues =
    data?.unifiedSearch?.edges
      ?.map((edge) => edge.node?.venue)
      .filter((item) => item) ?? [];
  const venuesAsItems = getVenuesAsItem(venues, locale);

  return (
    <List
      items={venuesAsItems.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    />
  );
}
