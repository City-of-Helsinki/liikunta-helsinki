import { gql } from "@apollo/client";

export const ADMINISTRATIVE_DIVISION_QUERY = gql`
  query AdministrativeDivisions {
    administrativeDivisions(helsinkiCommonOnly: true) {
      id
      type
      name {
        fi
        sv
        en
      }
    }
  }
`;
