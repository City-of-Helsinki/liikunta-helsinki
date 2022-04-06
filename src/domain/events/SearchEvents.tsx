import { ItemQueryResult } from "../../types";
import { useNextApiApolloClient } from "../nextApi/nextApiApolloClient";
import {
  useSearchEventsQuery,
  SearchEventsQuery,
  SearchEventsQueryVariables,
} from "../nextApi/searchEventsQuery";
import useRouter from "../i18n/router/useRouter";
import getEventsAsItems from "./utils/getEventsAsItems";
import getEventQueryFromCMSEventSearch from "./utils/getEventQueryFromCMSEventSearch";

type Props = {
  url: string;
  render: (
    renderProps: ItemQueryResult<SearchEventsQuery, SearchEventsQueryVariables>
  ) => JSX.Element;
  pageSize?: number;
};

export default function SearchEventsSection({ url, render, pageSize }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, ...queryResult } = useSearchEventsQuery({
    client: nextApiApolloClient,
    variables: {
      where: getEventQueryFromCMSEventSearch(url),
      first: pageSize,
      after: "",
    },
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
