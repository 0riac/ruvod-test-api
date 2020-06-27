const { gql } =  require('apollo-server');

const typeDef = gql`
  type Query {
    user(id: String!): User!
    users(skip: Int = 0, limit: Int = 1000): [User]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): User
  }

  type User {
    id: ID!
    email: String!
    name: String!
  }

  input CreateUserInput {
    email: String!
    name: String!
  }

  input UpdateUserInput {
    email: String
    name: String
  }
`;

module.exports = typeDef;
