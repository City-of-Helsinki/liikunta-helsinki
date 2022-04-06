import { ItemQueryResult } from "../../types";
import { useNextApiApolloClient } from "../nextApi/nextApiApolloClient";
import {
  useSelectedEventsQuery,
  SelectedEventsQuery,
  SelectedEventsQueryVariables,
} from "../nextApi/selectedEventsQuery";
import useRouter from "../i18n/router/useRouter";
import getEventsAsItems from "./utils/getEventsAsItems";

type Props = {
  events: string[];
  render: (
    renderProps: ItemQueryResult<
      SelectedEventsQuery,
      SelectedEventsQueryVariables
    >
  ) => JSX.Element;
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
  const { data, ...queryResult } = useSelectedEventsQuery({
    client: nextApiApolloClient,
    variables: { ids: eventIds, first: pageSize, after: "" },
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
