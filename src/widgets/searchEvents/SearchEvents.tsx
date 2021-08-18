import { useQuery, gql } from "@apollo/client";

import { useNextApiApolloClient } from "../../client/nextApiApolloClient";
import getEventsAsItems from "../../util/events/getEventsAsItems";
import eventFragment from "../../util/events/eventFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import { ItemsPromiseObject } from "../../types";

const SEARCH_EVENTS_QUERY = gql`
  query SearchEventsQuery($query: EventQuery!) {
    events(where: $query) {
      ...eventFragment
    }
  }

  ${eventFragment}
`;

function getEventQuery(url: string) {
  const params = new URL(url).searchParams;
  const { super_event_type, ...restOfQuery } = Object.fromEntries(params);

  return {
    ...restOfQuery,
    superEventType: super_event_type,
  };
}

type Props = {
  url: string;
  render: (renderProps: ItemsPromiseObject) => JSX.Element;
};

export default function SearchEventsSection({ url, render }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { loading, error, data } = useQuery(SEARCH_EVENTS_QUERY, {
    client: nextApiApolloClient,
    variables: { query: getEventQuery(url) },
    skip: !process.browser,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return render({ loading, error, items: getEventsAsItems(data?.events) });
}
