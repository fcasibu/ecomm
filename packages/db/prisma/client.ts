import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  // to fix re-initialization with hmr
  globalForPrisma.prisma ??= new PrismaClient();
  prismaClient = globalForPrisma.prisma;
}

export { prismaClient };
