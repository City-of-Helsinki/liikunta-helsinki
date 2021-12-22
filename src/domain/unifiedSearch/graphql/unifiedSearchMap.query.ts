import { gql } from "@apollo/client";

export const SEARCH_MAP_QUERY = gql`
  query SearchMap(
    $q: String
    $first: Int
    $after: String
    $language: UnifiedSearchLanguage!
    $administrativeDivisionIds: [ID!]
    $ontologyTreeIds: [ID!]
    $openAt: String
    $orderByDistance: OrderByDistance
    $orderByName: OrderByName
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $after
      languages: [$language]
      administrativeDivisionIds: $administrativeDivisionIds
      ontologyTreeIds: $ontologyTreeIds
      openAt: $openAt
      orderByDistance: $orderByDistance
      orderByName: $orderByName
    ) {
      count
      edges {
        node {
          venue {
            meta {
              id
            }
            name {
              fi
              sv
              en
            }
            location {
              geoLocation {
                geometry {
                  coordinates
                }
              }
            }
          }
        }
      }
    }
  }
`;
