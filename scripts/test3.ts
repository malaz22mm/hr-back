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

    // 🔥 check enum values directly from PostgreSQL
    const result = await prisma.$queryRaw`
        SELECT unnest(enum_range(NULL::"UserRole")) AS role;
    `;

    console.log("UserRole ENUM values:");
    console.log(result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });