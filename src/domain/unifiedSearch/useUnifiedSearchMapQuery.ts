import {
  useSearchMapQuery,
  SearchMapQueryVariables,
} from "./graphql/__generated__";
import useUnifiedSearchVariables, {
  OverridableVariables,
} from "./useUnifiedSearchVariables";
import searchApolloClient from "./searchApolloClient";

export default function useUnifiedSearchMapQuery(
  variables: OverridableVariables
) {
  const { fetchMore, ...delegated } = useSearchMapQuery({
    client: searchApolloClient,
    ssr: false,
    variables: useUnifiedSearchVariables(variables),
  });

  const handleFetchMore = (variables: Partial<SearchMapQueryVariables>) =>
    fetchMore({
      variables,
    });

  return {
    fetchMore: handleFetchMore,
    ...delegated,
  };
}
