/**
 * Vacation_Request seeder (table `Vacation_Request`, FK to `Employees.id`).
 *
 * From NestJS, reuse the same entrypoint with your `PrismaService` (it extends `PrismaClient`):
 *
 *   import { seedVacationRequests } from 'src/database/seed/vacation-request.seed';
 *   await seedVacationRequests(this.prisma, { clearExisting: true, maxTotal: 500 });
 */
import type { PrismaClient } from 'generated/prisma/client';

const REASONS = [
  'Annual leave',
  'Sick leave',
  'Family emergency',
  'Travel',
  'Personal reasons',
] as const;

export type VacationRequestSeedOptions = {
  /** Inclusive lower bound for requests per employee (default 1). */
  perEmployeeMin: number;
  /** Inclusive upper bound for requests per employee (default 5). */
  perEmployeeMax: number;
  /** Stop after this many rows inserted (optional). */
  maxTotal?: number;
  /** If set, use deterministic pseudo-random sequence. */
  seed?: number;
  /** Log each created row (default true). */
  verbose?: boolean;
  /** Delete all rows in Vacation_Request before seeding. */
  clearExisting?: boolean;
};

const DEFAULT_OPTIONS: VacationRequestSeedOptions = {
  perEmployeeMin: 1,
  perEmployeeMax: 5,
  verbose: true,
  clearExisting: false,
};

/** UTC calendar date at midnight (aligns with @db.Date). */
export function toUtcDateOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return toUtcDateOnly(next);
}

/** Inclusive calendar ranges overlap. */
export function vacationRangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  const as = toUtcDateOnly(aStart).getTime();
  const ae = toUtcDateOnly(aEnd).getTime();
  const bs = toUtcDateOnly(bStart).getTime();
  const be = toUtcDateOnly(bEnd).getTime();
  return as <= be && bs <= ae;
}

export function hasOverlapWithAny(
  start: Date,
  end: Date,
  existing: { startDate: Date; endDate: Date }[],
): boolean {
  for (const row of existing) {
    if (vacationRangesOverlap(start, end, row.startDate, row.endDate)) {
      return true;
    }
  }
  return false;
}

/** Mulberry32-style PRNG in [0, 1). */
export function createRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pickReason(rng: () => number): string {
  const i = randomInt(rng, 0, REASONS.length - 1);
  return REASONS[i]!;
}

function pickApproval(rng: () => number): boolean {
  return rng() < 0.8;
}

function randomStartInLastTwoYears(rng: () => number, now: Date): Date {
  const windowStart = new Date(now);
  windowStart.setUTCFullYear(windowStart.getUTCFullYear() - 2);
  windowStart.setUTCHours(0, 0, 0, 0);
  const end = toUtcDateOnly(now);
  const span = Math.max(0, end.getTime() - windowStart.getTime());
  const offset = span > 0 ? Math.floor(rng() * (span + 1)) : 0;
  return toUtcDateOnly(new Date(windowStart.getTime() + offset));
}

/**
 * Build non-overlapping vacation rows for one employee.
 */
export function buildVacationRowsForEmployee(
  empId: string,
  count: number,
  rng: () => number,
  now: Date,
  maxAttemptsPerRow = 80,
): { empId: string; startDate: Date; endDate: Date; reason: string; apprStatus: boolean }[] {
  const accepted: { startDate: Date; endDate: Date; reason: string; apprStatus: boolean }[] = [];

  for (let n = 0; n < count; n++) {
    let placed = false;
    for (let attempt = 0; attempt < maxAttemptsPerRow; attempt++) {
      const startDate = randomStartInLastTwoYears(rng, now);
      const durationDays = randomInt(rng, 1, 14);
      const endDate = addUtcDays(startDate, durationDays - 1);

      if (!hasOverlapWithAny(startDate, endDate, accepted)) {
        accepted.push({
          startDate,
          endDate,
          reason: pickReason(rng),
          apprStatus: pickApproval(rng),
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      console.warn(
        `[vacation seed] Could not place non-overlapping vacation #${n + 1} for employee ${empId} after ${maxAttemptsPerRow} attempts; skipping.`,
      );
    }
  }

  return accepted.map((row) => ({ empId, ...row }));
}

export type VacationRequestSeedResult = {
  inserted: number;
};

export async function seedVacationRequests(
  prisma: PrismaClient,
  partial: Partial<VacationRequestSeedOptions> = {},
): Promise<VacationRequestSeedResult> {
  const opts: VacationRequestSeedOptions = { ...DEFAULT_OPTIONS, ...partial };
  const { perEmployeeMin, perEmployeeMax, maxTotal, seed, verbose, clearExisting } = opts;

  if (perEmployeeMin < 0 || perEmployeeMax < perEmployeeMin) {
    throw new Error('Invalid per-employee bounds: require 0 <= min <= max.');
  }

  const rng = seed !== undefined ? createRng(seed) : () => Math.random();
  const now = new Date();

  if (clearExisting) {
    const deleted = await prisma.vacationRequest.deleteMany({});
    if (verbose) {
      console.log(`[vacation seed] Cleared ${deleted.count} existing vacation request(s).`);
    }
  }

  const employees = await prisma.employees.findMany({ select: { id: true } });
  if (employees.length === 0) {
    console.warn('[vacation seed] No employees found; nothing to seed.');
    return { inserted: 0 };
  }

  let inserted = 0;
  let budget = maxTotal ?? Number.POSITIVE_INFINITY;

  for (const { id: empId } of employees) {
    if (budget <= 0) {
      break;
    }

    let target = randomInt(rng, perEmployeeMin, perEmployeeMax);
    if (Number.isFinite(budget)) {
      target = Math.min(target, budget);
    }
    if (target <= 0) {
      continue;
    }

    const rows = buildVacationRowsForEmployee(empId, target, rng, now);
    for (const data of rows) {
      if (budget <= 0) {
        break;
      }
      const created = await prisma.vacationRequest.create({ data });
      inserted += 1;
      budget -= 1;
      if (verbose) {
        console.log(
          `[vacation seed] inserted id=${created.id} emp_id=${created.empId} ${created.startDate.toISOString().slice(0, 10)}..${created.endDate.toISOString().slice(0, 10)} reason="${created.reason}" apprStatus=${created.apprStatus}`,
        );
      }
    }
  }

  console.log(`[vacation seed] Done. Inserted ${inserted} vacation request(s).`);
  return { inserted };
}
