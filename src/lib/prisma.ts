// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// This setup prevents creating new PrismaClient instances during hot-reloading in development.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
