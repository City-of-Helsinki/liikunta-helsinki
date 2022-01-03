import {
  useSearchListQuery,
  SearchListQueryVariables,
} from "./graphql/__generated__";
import useUnifiedSearchVariables from "./useUnifiedSearchVariables";
import searchApolloClient from "./searchApolloClient";

export default function useUnifiedSearchListQuery() {
  const { fetchMore, ...delegated } = useSearchListQuery({
    client: searchApolloClient,
    ssr: false,
    variables: useUnifiedSearchVariables(),
  });

  const handleFetchMore = (variables: Partial<SearchListQueryVariables>) =>
    fetchMore({
      variables: { ...variables },
    });

  return {
    fetchMore: handleFetchMore,
    ...delegated,
  };
}
