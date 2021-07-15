import { gql } from "@apollo/client";

const eventFragment = gql`
  fragment eventFragment on Event {
    id
    name
    shortDescription
    startTime
    endTime
    infoUrl
    offers {
      isFree
      description
      price
      infoUrl
    }
    images {
      id
      alt
      url
    }
  }
`;

export default eventFragment;
