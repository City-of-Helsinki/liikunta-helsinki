import { gql } from "apollo-server-micro";

const typeDefs = gql`
  extend type Query {
    upcomingEvents(id: ID!): [Event]!
    eventsByIds(ids: [ID!]!): [Event]!
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
