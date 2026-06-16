  # Modules Analysis

  Per-module breakdown from actual controllers and services.

  ---

  ## PrismaModule

  | Item | Detail |
  |------|--------|
  | **Files** | `prisma.module.ts`, `prisma.service.ts` |
  | **Global** | Yes — no import needed in every module |
  | **Business logic** | None — infrastructure only |
  | **Lifecycle** | `$connect` / `$disconnect` |

  ---

  ## AuthModule

  ### Controllers — `AuthController` (`/auth`)

  | Method | Route | Public | Service method |
  |--------|-------|--------|----------------|
  | POST | `local/signin` | Yes | `signinLocal` |
  | POST | `logout` | No | `logout` |
  | POST | `refresh` | Yes + Rt guard | `refreshTokens` |
  | POST | `verify` | Yes | `verifyAccount` |
  | POST | `resend-verification-code` | Yes | `sendVerificationCode` |
  | POST | `request-reset-password` | Yes | `sendVerificationCode` |
  | POST | `reset-password` | Yes | `resetPassword` |

  ### DTOs

  `SignInDto`, `VerifingDto`, `UserIdDto`, `ResetPasswordDto`, `TokensDto` (swagger).

  ### Guards / strategies

  - `AtStrategy`, `RtStrategy` registered as providers.
  - Refresh route: `@UseGuards(AuthGuard('jwt-refresh'))`.

  ### Key DB queries

  - `users.findUnique` by email/phone/id.
  - `users.update` / `updateMany` for tokens, OTP, password, approval state.

  ### Email

  `EmailModule` → `EmailService.sendVerificationCode`.

  ---

  ## UsersModule

  ### Controller — `UsersController` (`/users`)

  **Class-level:** `@UseGuards(RolesGuard)` + `@Roles(SUPER_ADMIN)`.

  | Method | Route | DTO | Response |
  |--------|-------|-----|----------|
  | GET | `/` | `?search` | `Users[]` |
  | POST | `/` | `CreateUserDto` | string message |
  | DELETE | `:id` | UUID param | 204 |

  ### Service logic

  - `addUser` — bcrypt via `AuthService.hashData`, `users.create`.
  - `search` — OR `contains` on id, name, email, phone (case insensitive).
  - `deleteUser` — hard delete.

  ### Validation

  `CreateUserDto`: email, min password 6, optional `UserRole` enum.

  ---

  ## EmployeesModule

  ### Controller — `EmployeesController` (`/employees`)

  | Method | Auth | Roles |
  |--------|------|-------|
  | GET `/` | JWT | any |
  | GET `/stats` | JWT | any |
  | POST, PUT | JWT | SUPER_ADMIN |
  | DELETE `:id` | JWT | SUPER_ADMIN |

  ### DTOs

  - `EmployeeQueryDto` — pagination + 50+ optional filters.
  - `CreateEmployeeDto` / `UpdateEmployeeDto` — extend `BaseEmployeeDto` (snake_case fields match Prisma).
  - `EmployeeStatsDto` — `groupBy` enum of FK column names.

  ### `findAll` query flow

  1. Build `where` from filters (see database doc for bugs).
  2. `orderBy`: optional `sortBy` + always `id asc`.
  3. `findMany` + `count`.
  4. Return `{ data, meta }`.

  ### `getStats`

  `groupBy` + `_avg` → mapped DTO-shaped objects.

  ### `deleteEmployee`

  Transaction: delete attendance → vacations → employee.

  ---

  ## AttendanceModule

  ### Endpoints

  | Route | Service | Prisma |
  |-------|---------|--------|
  | POST `punch` | `punch(empId)` | see below |
  | GET `presence` | `getWhoIsIn()` | open sessions |
  | GET `employee/:id` | `getEmployeeHistory` | date range |

  ### Smart punch logic (step-by-step)

  ```typescript
  // 1. Active session?
  findFirst({ emp_id, check_out: null }, orderBy check_in desc)

  // 2a. If found → CHECK OUT
  update({ check_out: now })

  // 2b. Else → CHECK IN
  findUnique employee + WorkShift
  create({ emp_id, shift_id: employee.work_shift_id, check_in: now })
  ```

  **Why smart punch?** Hardware sends one button; server decides in vs out.

  ### Presence query

  ```typescript
  findMany({ check_out: null, include: { Employee: { select: { name, department_id, Department } } } })
  ```

  Everyone without checkout = “in building.”

  ### History query

  ```typescript
  findMany({
    where: { emp_id, check_in: { gte: start, lte: end } },
    include: { WorkShift: true },
    orderBy: { check_in: 'desc' }
  })
  ```

  Controller defaults: last 7 days if `start`/`end` omitted.

  ---

  ## VacationsModule

  ### Endpoints

  | Route | Purpose |
  |-------|---------|
  | POST `/` | Create pending request |
  | GET `/` | All requests (optional `status`) |
  | GET `employee/:empId` | Employee history |
  | PATCH `:id/process` | Approve/reject |

  ### `createRequest` logic

  1. Reject past `start`.
  2. Reject `start > end`.
  3. Overlap query: same `emp_id`, status in `[0,1]`, date ranges intersect.
  4. Create with `approval_status: 0`.

  ### `processRequest`

  - Only `statusId` 1 or 2.
  - Sets `processed_by`, `processed_at`.
  - Returns relations for UI.

  ### Risk

  `adminId` from body — document in security file.

  ---

  ## LookupModule

  ### Purpose

  Serve **read-only reference data** for forms and filter dropdowns without hardcoding IDs in frontend.

  ### Endpoints (all GET, JWT required)

  `departments`, `job-roles`, `education-levels`, `marital-statuses`, `business-travel`, `performance-ratings`, `attrition-risk-classes`, `shifts`, `vacation-statuses`, `satisfaction-scales`.

  ### Queries

  Simple `findMany` + `orderBy` on each model — no pagination (small tables).

  ### Why lookup tables?

  - Normalize employee FKs.
  - Consistent labels (`name`, `name_code`).
  - Same IDs used in filters (`departmentId=2`).

  ---

  ## AppController

  | Route | Purpose |
  |-------|---------|
  | GET `/` | API metadata + doc links |
  | GET `/health` | Health check |
  | GET `/swagger-spec.json` | 302 → `/docs-json` |

  All `@MyPublic()`.

  ---

  ## Module dependency diagram

  ```mermaid
  flowchart LR
    UsersModule --> AuthModule
    AuthModule --> EmailModule
    EmployeesModule --> PrismaModule
    AttendanceModule --> PrismaModule
    VacationsModule --> PrismaModule
    LookupModule --> PrismaModule
    AuthModule --> PrismaModule
  ```

  ---

  ## Employees filter reference (API → DB)

  | Query param | Prisma field |
  |-------------|--------------|
  | `departmentId` | `department_id` |
  | `minAge` / `maxAge` | `age` gte/lte |
  | `sortBy` | must be valid column e.g. `monthly_income` |
  | `overTime` | `over_time` |

  Full list in `EmployeeQueryDto` + `employees.service.ts` idFilters/numericFilters.
