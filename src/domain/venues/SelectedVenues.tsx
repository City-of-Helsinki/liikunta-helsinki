import { ItemQueryResult } from "../../types";
import { useNextApiApolloClient } from "../nextApi/nextApiApolloClient";
import useRouter from "../i18n/router/useRouter";
import {
  useSelectedVenuesQuery,
  SelectedVenuesQuery,
  SelectedVenuesQueryVariables,
} from "../nextApi/selectedVenuesQuery";
import getVenuesAsItems from "./utils/getVenuesAsItems";

type Props = {
  venues: string[];
  render: (
    renderProps: ItemQueryResult<
      SelectedVenuesQuery,
      SelectedVenuesQueryVariables
    >
  ) => JSX.Element;
};

export default function SelectedVenues({ venues: venueIds, render }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, ...queryResult } = useSelectedVenuesQuery({
    client: nextApiApolloClient,
    variables: {
      ids: venueIds.map((id) => `tprek:${id}`),
    },
    ssr: false,
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
