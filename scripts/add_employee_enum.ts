import { PrismaClient } from '../generated/prisma/client';
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

async function main() {
    const adapter = new PrismaPg({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT),
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const prisma = new PrismaClient({
        adapter: adapter
    });

    // 🔥 add enum value safely
    await prisma.$executeRaw`
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'EMPLOYEE';
    `;

    console.log("✅ EMPLOYEE added to UserRole enum (if not existed)");

    // 🔍 verify result
    const result = await prisma.$queryRaw`
        SELECT unnest(enum_range(NULL::"UserRole")) AS role;
    `;

    console.log("Current UserRole enum values:");
    console.log(result);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });