import { gql } from "@apollo/client";

export const ONTOLOGY_TREE_QUERY = gql`
  query OntologyTree($rootId: ID) {
    ontologyTree(rootId: $rootId, leavesOnly: true) {
      id
      name {
        fi
        sv
        en
      }
    }
  }
`;
