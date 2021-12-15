import { gql } from "@apollo/client";

import createApolloServer from "../createApolloServer";

const GET_VENUE = gql`
  query GetVenueTestQuery($id: ID!) {
    venue(id: $id) {
      addressLocality
      dataSource
      description
      email
      id
      isOpen
      image
      infoUrl
      name
      accessibilitySentences {
        groupName
        sentences
      }
      openingHours {
        date
        times {
          startTime
          endTime
          endTimeOnNextDay
          resourceState
          fullDay
        }
      }
      position {
        type
        coordinates
      }
      postalCode
      streetAddress
      telephone
      ontologyWords {
        id
        label
      }
      ontologyTree {
        id
        label
      }
    }
  }
`;

const server = createApolloServer({
  context: () => {
    return {
      language: "fi",
    };
  },
  plugins: [],
});

test("venue(id) should return a complete venue", async () => {
  const res = await server.executeOperation({
    query: GET_VENUE,
    variables: { id: "tprek:1234" },
  });

  expect(res).toMatchSnapshot();
});

test("venue(id) with incorrect id should error", async () => {
  const res = await server.executeOperation({
    query: GET_VENUE,
    variables: { id: "notsupported:1234" },
  });

  expect(res).toMatchSnapshot();
});
