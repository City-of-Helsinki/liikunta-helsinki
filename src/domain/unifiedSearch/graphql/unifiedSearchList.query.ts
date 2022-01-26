import { gql } from "@apollo/client";

export const SEARCH_LIST_QUERY = gql`
  query SearchList(
    $q: String
    $first: Int
    $after: String
    $language: UnifiedSearchLanguage!
    $administrativeDivisionIds: [ID!]
    $ontologyTreeIds: [ID!]
    $ontologyWordIds: [ID!]
    $openAt: String
    $orderByDistance: OrderByDistance
    $orderByName: OrderByName
    $includeHaukiFields: Boolean = true
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $after
      languages: [$language]
      administrativeDivisionIds: $administrativeDivisionIds
      ontologyTreeIds: $ontologyTreeIds
      ontologyWordIds: $ontologyWordIds
      openAt: $openAt
      orderByDistance: $orderByDistance
      orderByName: $orderByName
    ) {
      count
      pageInfo {
        endCursor
        hasNextPage
      }
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
            description {
              fi
            }
            images {
              url
            }
            openingHours @include(if: $includeHaukiFields) {
              today {
                startTime
                endTime
                endTimeOnNextDay
                fullDay
                resourceState
              }
              data {
                date
                times {
                  startTime
                  endTime
                  endTimeOnNextDay
                  fullDay
                  resourceState
                }
              }
            }
            location {
              address {
                streetAddress {
                  fi
                  sv
                  en
                }
                postalCode
                city {
                  fi
                  sv
                  en
                }
              }
              geoLocation {
                geometry {
                  coordinates
                }
              }
            }
            ontologyWords {
              id
              label {
                fi
                sv
                en
              }
            }
          }
        }
      }
    }
  }
`;
