import { gql } from "@apollo/client";

const unifiedSearchVenueFragment = gql`
  fragment unifiedSearchVenueFragment on Venue {
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
    openingHours {
      today {
        startTime
        endTime
        endTimeOnNextDay
        fullDay
        resourceState
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
`;

export default unifiedSearchVenueFragment;
