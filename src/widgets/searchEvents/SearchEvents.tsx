import { useQuery, gql } from "@apollo/client";

import { ItemQueryResult } from "../../types";
import { useNextApiApolloClient } from "../../client/nextApiApolloClient";
import eventFragment from "../../util/events/eventFragment";
import getEventsAsItems from "../../util/events/getEventsAsItems";
import useRouter from "../../domain/i18n/router/useRouter";

const SEARCH_EVENTS_QUERY = gql`
  query SearchEventsQuery($where: EventQuery!, $first: Int, $after: String) {
    events(where: $where, first: $first, after: $after) {
      edges {
        node {
          ...eventFragment
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        count
      }
      totalCount
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
  render: <TVariables>(renderProps: ItemQueryResult<TVariables>) => JSX.Element;
  pageSize?: number;
};

export default function SearchEventsSection({ url, render, pageSize }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, ...queryResult } = useQuery(SEARCH_EVENTS_QUERY, {
    client: nextApiApolloClient,
    variables: { where: getEventQuery(url), first: pageSize, after: "" },
    skip: !process.browser,
    ssr: false,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  return render({
    ...queryResult,
    items: getEventsAsItems(data?.events?.edges?.map((edge) => edge.node)),
    pageInfo: data?.events?.pageInfo,
    totalCount: data?.events?.totalCount,
  });
}
