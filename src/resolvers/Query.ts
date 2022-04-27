import { Context } from './../index';
import { Transaction, Prisma } from "@prisma/client";

interface TransactionFiltersType {
  filters: {
    accountId?:  string
    startDate:   string
    endDate:     string
    sortOrder:   string
    take:       string
    cursor?:     string
  }
}

interface TransactionId {
  transactionId: string
}

// async getCursorPaginationList(params: {
//   take?: number;
//   cursor?: Prisma.BookWhereUniqueInput;
// }): Promise<Book[]> {
//   const { take, cursor } = params;

//   return this.dbService.book.findMany({
//       take,
//       skip: 1,
//       cursor
//   })
// }

export const Query = {
  accounts: (_: any, __:any, { prisma }: Context) => {
    return prisma.account.findMany({
      orderBy: [
        {
          id: "desc"
        },
      ]
    })
  },
  categories: (_: any, __:any, { prisma }: Context) => {
    return prisma.category.findMany({
      orderBy: [
        {
          id: "desc"
        },
      ]
    })
  },
  transactions: (_: any, { filters }: TransactionFiltersType, { prisma }: Context) => {
    let { accountId, startDate, endDate, sortOrder, take, cursor } = filters

    let dbFetch

    if (!cursor) {
      dbFetch = prisma.transaction.findMany({
        take: parseInt(take),
        where: {
          accountId: accountId ? accountId : undefined,
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lt:  endDate ? new Date(endDate) : undefined,
          },
        },
        orderBy: [
          {
            id: sortOrder as Prisma.SortOrder
          },
        ],
        include: {
          category: true,
          account: true,
        }
      })
    } else {
      dbFetch = prisma.transaction.findMany({
        take: parseInt(take),
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          accountId: accountId ? accountId : undefined,
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lt:  endDate ? new Date(endDate) : undefined,
          },
        },
        orderBy: [
          {
            date: sortOrder as Prisma.SortOrder
          },
        ],
        include: {
          category: true,
          account: true,
        }
      })
    }

    return dbFetch
  },
  transaction: (_: any, { transactionId }: TransactionId, { prisma }: Context) => {
    return prisma.transaction.findFirst({
      where: {
        id: transactionId
      },
      include: {
        category: true,
        account: true,
      }
    })
  }
};