import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import { Query } from './resolvers'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  let results =  await next(params)

  if (params.model == 'Transaction' && params.action == 'findMany') {
    results = results.map((result: any) => {
      return {
        ...result,
        amount: parseInt(result.amount) / 100,
        date: new Date(result.date).toLocaleDateString('en-CA'),
      }
    })
  }

  return results
})

export interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
  },
  context: {
    prisma,
  }
})

server.listen().then(({url}) => {
  console.log(`Server ready on port ${url}`)
})
