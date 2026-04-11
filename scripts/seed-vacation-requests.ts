/**
 * Standalone seeder for Vacation_Request (see prisma/schema.prisma).
 *
 * Run from project root (requires DB_* env vars like other scripts):
 *   npx ts-node -r tsconfig-paths/register -r dotenv/config scripts/seed-vacation-requests.ts
 *
 * Or npm script:
 *   npm run seed:vacations
 *
 * Options (CLI):
 *   --per-employee-min=N   default 1
 *   --per-employee-max=N   default 5
 *   --max-total=N          stop after N inserts (optional)
 *   --seed=N               deterministic RNG (optional)
 *   --clear                delete all vacation rows before insert
 *   --quiet                less logging
 *   --dry-run              plan only (no DB writes)
 */
import * as dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  seedVacationRequests,
  type VacationRequestSeedOptions,
} from '../src/database/seed/vacation-request.seed';

dotenv.config();

function parseArgs(argv: string[]): Partial<VacationRequestSeedOptions> & {
  dryRun?: boolean;
  quiet?: boolean;
} {
  const out: Partial<VacationRequestSeedOptions> & { dryRun?: boolean; quiet?: boolean } = {};
  for (const arg of argv) {
    if (arg === '--clear') {
      out.clearExisting = true;
      continue;
    }
    if (arg === '--dry-run') {
      out.dryRun = true;
      continue;
    }
    if (arg === '--quiet') {
      out.quiet = true;
      continue;
    }
    const m = /^--([^=]+)=(.*)$/.exec(arg);
    if (!m) {
      continue;
    }
    const key = m[1];
    const val = m[2];
    switch (key) {
      case 'per-employee-min':
        out.perEmployeeMin = Number(val);
        break;
      case 'per-employee-max':
        out.perEmployeeMax = Number(val);
        break;
      case 'max-total':
        out.maxTotal = Number(val);
        break;
      case 'seed':
        out.seed = Number(val);
        break;
      default:
        console.warn(`[vacation seed] Unknown flag: ${arg}`);
    }
  }
  return out;
}

function createScriptPrisma(): PrismaClient {
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
  return new PrismaClient({ adapter });
}

async function main(): Promise<void> {
  const cli = parseArgs(process.argv.slice(2));
  const dryRun = cli.dryRun === true;
  const verbose = cli.quiet !== true;

  const options: Partial<VacationRequestSeedOptions> = {
    perEmployeeMin: cli.perEmployeeMin ?? 1,
    perEmployeeMax: cli.perEmployeeMax ?? 5,
    maxTotal: cli.maxTotal,
    seed: cli.seed,
    clearExisting: cli.clearExisting ?? false,
    verbose,
  };

  if (dryRun) {
    console.log('[vacation seed] Dry run — options:', JSON.stringify(options, null, 2));
    console.log('[vacation seed] Dry run — no database changes.');
    return;
  }

  const prisma = createScriptPrisma();
  try {
    await seedVacationRequests(prisma, options);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[vacation seed] Failed:', err);
  process.exit(1);
});
