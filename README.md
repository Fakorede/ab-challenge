# Airbank Challenge

### Built With

- Node.js
- Typescript
- Apollo Graphql
- Prisma

### Getting Started

Clone and Install packages

```
git clone https://github.com/Fakorede/ab-challenge.git
cd ab-challenge
npm install
```

### Setup Database

Create `.env` file at the root of the project to and the environment variables. Ensure to replace the `DATABASE_URL` with the correct values.

```
DATABASE_URL="postgresql://{username}:{password}@localhost:5432/{dbname}"
NODE_ENV=development
```

### Seed Database

Use below commands to create db tables from the prisma schema and seed tables with data.

```
npx prisma db push
npx prisma db seed
```

Use `npx prisma studio` command to interact with the database.

### Run API

```
npm run start:dev
```