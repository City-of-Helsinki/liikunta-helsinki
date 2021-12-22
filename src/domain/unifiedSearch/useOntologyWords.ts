import {
  useOntologyWordsQuery,
  OntologyWordsQueryVariables,
} from "./graphql/__generated__";
import searchApolloClient from "./searchApolloClient";

export default function useOntologyWords(
  variables?: OntologyWordsQueryVariables
) {
  const { data, ...delegated } = useOntologyWordsQuery({
    client: searchApolloClient,
    variables,
  });

  return {
    ontologyWords: data?.ontologyWords,
    ...delegated,
  };
}
