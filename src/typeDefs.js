import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    helloWorld: String!
    users: [User!]!
  }

  type User {
    id: ID!
    email: String
    first_name: String
    last_name: String
  }

  type Mutation {
    createUser(email: String!, first_name: String!, last_name: String!): User!
  }
`;
