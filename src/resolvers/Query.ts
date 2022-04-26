import { Context } from './../index';

interface TransactionFiltersType {
  filters: {
    accountId?:  string
    startDate:  string
    endDate:    string
  }
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
    let { accountId, startDate, endDate } = filters

    return prisma.transaction.findMany({
      take: 10,
      // skip: 5,
      // cursor: {
      //   id: myCursor,
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
          id: "desc"
        },
      ],
      include: {
        category: true,
        account: true,
      }
    })
  },
};