import { Prisma, PrismaClient } from '@prisma/client';
import logger from './logger.js';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? [{ emit: 'event', level: 'query' }] : ['warn', 'error'],
  });

prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
  logger.debug('query' + e.query);
  logger.debug(`params: ${e.params}, duration: ${e.duration}ms`);
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
