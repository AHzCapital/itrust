import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __trustmePrisma: PrismaClient | undefined;
}

export const prisma = globalThis.__trustmePrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.__trustmePrisma = prisma;
