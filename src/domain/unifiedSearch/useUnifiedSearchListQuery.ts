import {
  useSearchListQuery,
  SearchListQueryVariables,
  SearchListQuery,
} from "./graphql/__generated__";
import useUnifiedSearchVariables from "./useUnifiedSearchVariables";
import searchApolloClient from "./searchApolloClient";
import AppConfig from "../../domain/app/AppConfig";

type HookConfig = {
  variables?: Partial<Omit<SearchListQueryVariables, "enableHauki">>;
};

export default function useUnifiedSearchListQuery({
  variables,
}: HookConfig = {}) {
  const { fetchMore, ...delegated } = useSearchListQuery({
    client: searchApolloClient,
    ssr: false,
    variables: {
      ...useUnifiedSearchVariables(),
      ...variables,
      includeHaukiFields: AppConfig.isHaukiEnabled,
    },
  });

  const handleFetchMore = (variables: Partial<SearchListQueryVariables>) =>
    fetchMore({
      variables,
    });

  return {
    fetchMore: handleFetchMore,
    ...delegated,
  };
}

export type ListVenue =
  SearchListQuery["unifiedSearch"]["edges"][number]["node"]["venue"];
