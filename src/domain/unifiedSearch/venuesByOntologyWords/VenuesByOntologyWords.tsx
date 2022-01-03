import { useQuery, gql } from "@apollo/client";
import { LoadingSpinner, IconLocation } from "hds-react";

import { Item, Venue } from "../../../types";
import List from "../../../common/components/list/List";
import Card from "../../../common/components/card/DefaultCard";
import { Locale } from "../../../config";
import getTranslation from "../../../common/utils/getTranslation";
import useRouter from "../../i18n/router/useRouter";
import unifiedSearchVenueFragment from "../unifiedSearchResultVenueFragment";
import searchApolloClient from "../searchApolloClient";
import capitalize from "../../../common/utils/capitalize";

const VENUES_WITH_ONTOLOGIES_QUERY = gql`
  query LocationsWithOntologiesQuery($ontologyWordIds: [ID!]) {
    unifiedSearch(
      q: "*"
      ontologyWordIds: $ontologyWordIds
      index: "location"
      first: 4
    ) {
      edges {
        node {
          venue {
            ...unifiedSearchVenueFragment
          }
        }
      }
    }
  }

  ${unifiedSearchVenueFragment}
`;

function getVenuesAsItem(venues: Venue[], locale: Locale): Item[] {
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
  const { data, loading } = useQuery(VENUES_WITH_ONTOLOGIES_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      ontologyWordIds,
    },
    fetchPolicy: "cache-and-network",
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
