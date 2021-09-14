import { useQuery, gql } from "@apollo/client";

import { useNextApiApolloClient } from "../../clients/nextApiApolloClient";
import eventFragment from "../eventFragment";
import useRouter from "../../i18n/router/useRouter";
import { ItemQueryResult } from "../../../types";
import getEventsAsItems from "../utils/getEventsAsItems";

const SELECTED_EVENTS_QUERY = gql`
  query SelectedEventsQuery($ids: [ID!]!, $first: Int, $after: String) {
    events(where: { ids: $ids }, first: $first, after: $after) {
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
  events: string[];
  render: <TVariables>(renderProps: ItemQueryResult<TVariables>) => JSX.Element;
  pageSize?: number;
};

export default function SelectedEventsSection({
  events: eventIds,
  render,
  pageSize,
}: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, ...queryResult } = useQuery(SELECTED_EVENTS_QUERY, {
    client: nextApiApolloClient,
    variables: { ids: eventIds, first: pageSize, after: "" },
    skip: !process.browser,
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
