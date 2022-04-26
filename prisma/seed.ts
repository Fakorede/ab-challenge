import fs from "fs"
import path from "path"
import csv from "csv-parser"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TransactionDataType {
  id: string,
  accountId: string,
  categoryId: string,
  reference?: string,
  amount: string,
  currency: string,
  date: Date,
}

interface AccountDataType {
  id: string,
  name: string,
}

interface CategoryDataType {
  id: string,
  name: string,
  color: string,
}

let accountsSeeder: AccountDataType[] = [];
let categoriesSeeder: CategoryDataType[] = [];
let transactionsSeeder: TransactionDataType[] = [];

const accountsDataPath = "accounts.csv"
const categoriesDataPath = "categories.csv"
const transactionsDataPath = "transactions.csv"

async function main() {
  if (process.env.NODE_ENV !== 'development') return

  await prisma.transaction.deleteMany()
  await prisma.account.deleteMany()
  await prisma.category.deleteMany()

  fs.createReadStream(path.join(__dirname, `/../data/${accountsDataPath}`))
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      accountsSeeder.push(data)
    })
    .on('end', async () => {
      await prisma.account.createMany({
        data: accountsSeeder
      })
    })

  fs.createReadStream(path.join(__dirname, `/../data/${categoriesDataPath}`))
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      categoriesSeeder.push(data)
    })
    .on('end', async () => {
      await prisma.category.createMany({
        data: categoriesSeeder
      })
    })

  fs.createReadStream(path.join(__dirname, `/../data/${transactionsDataPath}`))
    .pipe(csv({ separator: ',' }))
    .on('data', (transaction) => {
      if (transaction.categoryId) {
        transactionsSeeder.push({
          ...transaction,
          amount: String(transaction.amount * 100),
          date: new Date(transaction.date)
        })
      }
    })
    .on('end', async () => {
      await prisma.transaction.createMany({
        data: transactionsSeeder,
      })
    })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })