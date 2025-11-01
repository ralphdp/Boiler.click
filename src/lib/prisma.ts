/* Prisma client for database */
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = (): PrismaClient => {
  const dbUrl = process.env.DATABASE_URL || "";
  
  // Check if using Prisma Accelerate (URL starts with prisma://)
  const isUsingAccelerate = dbUrl.startsWith("prisma://");
  
  if (isUsingAccelerate) {
    console.log("Using Prisma Accelerate");
    return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;
  } else {
    console.log("Using direct database connection");
    return new PrismaClient();
  }
};

declare global {
  var prismaGlobal: undefined | PrismaClient;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
