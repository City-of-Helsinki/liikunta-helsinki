import { useQuery, gql } from "@apollo/client";

import { ItemQueryResult } from "../../types";
import { useNextApiApolloClient } from "../clients/nextApiApolloClient";
import useRouter from "../i18n/router/useRouter";
import getVenuesAsItems from "./utils/getVenuesAsItems";

const SELECTED_VENUES_QUERY = gql`
  query SelectedVenuesQuery($ids: [ID!]!) {
    venuesByIds(ids: $ids) {
      description
      id
      image
      name
      ontologyWords {
        id
        label
      }
    }
  }
`;

type Props = {
  venues: string[];
  render: <TVariables>(renderProps: ItemQueryResult<TVariables>) => JSX.Element;
};

export default function SelectedVenues({ venues: venueIds, render }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, ...queryResult } = useQuery(SELECTED_VENUES_QUERY, {
    client: nextApiApolloClient,
    variables: {
      ids: venueIds.map((id) => `tprek:${id}`),
    },
    skip: !process.browser,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
  });

  return render({
    ...queryResult,
    items: getVenuesAsItems(data?.venuesByIds),
    totalCount: data?.venuesByIds?.length,
  });
}
