import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

async function fixUserRoleEnum() {
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
    adapter,
  });

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TYPE "UserRole"
      ADD VALUE IF NOT EXISTS 'EMPLOYEE';
    `);

    console.log('EMPLOYEE role added successfully');
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoleEnum();