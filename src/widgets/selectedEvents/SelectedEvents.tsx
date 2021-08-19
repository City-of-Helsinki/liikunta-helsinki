import { useQuery, gql } from "@apollo/client";

import { useNextApiApolloClient } from "../../client/nextApiApolloClient";
import getEventsAsItems from "../../util/events/getEventsAsItems";
import eventFragment from "../../util/events/eventFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import { ItemsPromiseObject } from "../../types";

const SELECTED_EVENTS_QUERY = gql`
  query SelectedEventsQuery($ids: [ID!]!) {
    events(where: { ids: $ids }) {
      edges {
        node {
          ...eventFragment
        }
      }
    }
  }

  ${eventFragment}
`;

type Props = {
  events: string[];
  render: (renderProps: ItemsPromiseObject) => JSX.Element;
};

export default function SelectedEventsSection({
  events: eventIds,
  render,
}: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { loading, error, data } = useQuery(SELECTED_EVENTS_QUERY, {
    client: nextApiApolloClient,
    variables: { ids: eventIds },
    skip: !process.browser,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return render({
    loading,
    error,
    items: getEventsAsItems(data?.events?.edges?.map((edge) => edge.node)),
  });
}
