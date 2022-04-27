import { Context } from './../index';
import { Transaction, Prisma } from "@prisma/client";

interface TransactionFiltersType {
  filters: {
    accountId?:  string
    startDate:   string
    endDate:     string
    sortOrder:   string
    take?:       number
    cursor?:     number
  }
}

interface TransactionId {
  transactionId: string
}

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

    // if (cursor) {
    //   where.id < cursor
    // }

    return prisma.transaction.findMany({
      take: 10,
      // skip: 1,
      // cursor: {
      //   id: String(cursor),
      // },
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