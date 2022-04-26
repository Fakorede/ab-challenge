import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Query {
    accounts: [Account!]!,
    categories: [Category!]!,
    transaction(transactionId: String): Transaction
    transactions(cursor: String, filters: TransactionFilters): [Transaction!]!,
  },

  type Account {
    id:       ID!
    name:     String!
  },

  type Category {
    id:       ID!
    name:     String!
    color:     String!
  }

  type Transaction {
    id:         ID!
    accountId: String!
    categoryId: String
    reference:  String!
    amount:     String!
    currency:   String!
    date:       String!

    account:    Account
    category:   Category
  }

  input TransactionFilters {
    accountId:  String
    startDate:  String
    endDate:    String
  }
`