import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { LocalizedString } from "../../types";
import searchApolloClient from "./searchApolloClient";

type OntologyWord = {
  id: string;
  label: LocalizedString;
};

type OntologyQueryVariables = { id: number[] };

const ONTOLOGY_WORDS_QUERY = gql`
  query OntologyWordsQuery($id: [ID!]) {
    ontologyWords(id: $id) {
      id
      label {
        fi
        sv
        en
      }
    }
  }
`;

const useOntologyWords = (variables?: OntologyQueryVariables) => {
  const { data, ...delegated } = useQuery<
    { ontologyWords?: OntologyWord[] },
    OntologyQueryVariables
  >(ONTOLOGY_WORDS_QUERY, {
    client: searchApolloClient,
    variables,
  });

  return {
    ontologyWords: data?.ontologyWords,
    ...delegated,
  };
};

export default useOntologyWords;
