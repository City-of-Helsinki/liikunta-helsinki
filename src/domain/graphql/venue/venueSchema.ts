import { gql } from "apollo-server-micro";

const typeDefs = gql`
  extend type Query {
    venue(id: ID!): Venue!
    venuesByIds(ids: [ID!]): [Venue!]!
  }

  type Point {
    type: String
    coordinates: [Float!]!
  }

  enum ResourceState {
    open
    closed
    undefined
    self_service
    with_key
    with_reservation
    open_and_reservable
    with_key_and_reservation
    enter_only
    exit_only
    weather_permitting
  }

  type Time {
    name: String!
    description: String!
    startTime: String!
    endTime: String!
    endTimeOnNextDay: Boolean!
    resourceState: ResourceState!
    fullDay: Boolean!
    periods: [Int!]!
  }

  type OpeningHour {
    date: String!
    times: [Time!]!
  }

  type Ontology {
    id: Int
    label: String
  }

  type AccessibilitySentences {
    groupName: String
    sentences: [String]
  }

  type Venue {
    addressLocality: String
    dataSource: String
    description: String
    email: String
    id: String!
    image: String
    infoUrl: String
    name: String
    position: Point
    postalCode: String
    streetAddress: String
    telephone: String
    openingHours: [OpeningHour!]
    isOpen: Boolean
    ontologyTree: [Ontology]!
    ontologyWords: [Ontology]!
    accessibilitySentences: [AccessibilitySentences]!
  }
`;

export default typeDefs;
