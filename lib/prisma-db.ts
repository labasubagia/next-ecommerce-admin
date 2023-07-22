import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === 'production';

let prismaDb: PrismaClient;
if (globalThis.prisma) {
  prismaDb = globalThis.prisma;
} else {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });

  // Log query
  if (!isProduction) {
    prisma.$on('query', console.log);
  }

  prismaDb = prisma;
}

if (!isProduction) globalThis.prisma = prismaDb;

export default prismaDb;
