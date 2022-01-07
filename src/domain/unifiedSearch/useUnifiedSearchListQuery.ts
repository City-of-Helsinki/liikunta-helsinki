import {
  useSearchListQuery,
  SearchListQueryVariables,
  SearchListQuery,
} from "./graphql/__generated__";
import useUnifiedSearchVariables from "./useUnifiedSearchVariables";
import searchApolloClient from "./searchApolloClient";

type Config = {
  variables?: Partial<SearchListQueryVariables>;
};

export default function useUnifiedSearchListQuery({ variables }: Config = {}) {
  const { fetchMore, ...delegated } = useSearchListQuery({
    client: searchApolloClient,
    ssr: false,
    variables: { ...useUnifiedSearchVariables(), ...variables },
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
