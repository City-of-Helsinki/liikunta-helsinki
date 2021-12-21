import { gql } from "apollo-server-micro";

const typeDefs = gql`
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
    count: Int!
  }
`;

export default typeDefs;
