import { gql } from "@apollo/client";

export const ONTOLOGY_WORDS_QUERY = gql`
  query OntologyWords($ids: [ID!]) {
    ontologyWords(ids: $ids) {
      id
      label {
        fi
        sv
        en
      }
    }
  }
`;
