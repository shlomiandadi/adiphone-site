import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'minimal',
  }).$extends({
    result: {
      post: {
        createdAt: {
          needs: { createdAt: true },
          compute(post) {
            return new Date(post.createdAt);
          }
        },
        updatedAt: {
          needs: { updatedAt: true },
          compute(post) {
            return new Date(post.updatedAt);
          }
        }
      }
    }
  });
};

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma; 