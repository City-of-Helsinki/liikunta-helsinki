import { gql } from "apollo-server-micro";

const typeDefs = gql`
  input EventQuery {
    ids: [ID!]
    start: String
    location: ID
    sort: String
    superEventType: String
    language: String
    text: String
    translation: String
  }

  extend type Query {
    upcomingEvents(id: ID!): [Event]!
    events(where: EventQuery, first: Int, after: String): EventsConnection!
  }

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
    count: Int!
  }

  type EventsConnection {
    edges: [EventEdge!]!
    pageInfo: PageInfo
    totalCount: Int
  }

  type EventEdge {
    node: Event!
    cursor: String!
  }

  type Image {
    id: String!
    url: String!
    alt: String
  }

  type Offer {
    isFree: Boolean!
    description: String
    infoUrl: String
    price: String
  }

  type Event {
    id: String!
    name: String!
    shortDescription: String
    offers: [Offer!]!
    startTime: String!
    endTime: String
    images: [Image!]!
    infoUrl: String
  }
`;

export default typeDefs;
