import { useQuery, gql } from "@apollo/client";

import { ItemQueryResult } from "../../../types";
import { useNextApiApolloClient } from "../../clients/nextApiApolloClient";
import eventFragment from "../eventFragment";
import getEventsAsItems from "../utils/getEventsAsItems";
import getEventQueryFromCMSEventSearch from "../utils/getEventQueryFromCMSEventSearch";
import useRouter from "../../i18n/router/useRouter";

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
    variables: {
      where: getEventQueryFromCMSEventSearch(url),
      first: pageSize,
      after: "",
    },
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
