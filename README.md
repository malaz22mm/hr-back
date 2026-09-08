# HR Analytics & Employee Management API

A modular REST API for employee operations, workforce analytics, attendance, vacation workflows, and attrition-risk insights. Built with NestJS, TypeScript, Prisma, and PostgreSQL, the API powers the companion [HR Analytics Dashboard](https://github.com/malaz22mm/hr-ai-dashboard).

## Highlights

- Access and refresh token authentication with Passport JWT
- Email verification and password recovery using one-time codes
- Role-based access control for employees, administrators, and super administrators
- Employee CRUD operations with pagination, sorting, categorical filters, and numeric ranges
- Grouped workforce statistics for dashboards and reports
- Attendance check-in, check-out, and history workflows
- Vacation request submission and administrative review
- Employee-to-user account management
- Attrition-risk prediction through `GET /employees/:id/predictions/attrition`
- DTO validation and an OpenAPI contract generated with Swagger
- Local Node.js runtime and a serverless entry point for Vercel

## Tech stack

| Area | Technologies |
|---|---|
| Framework | NestJS 11, TypeScript |
| Database | PostgreSQL, Prisma 7, Prisma PostgreSQL adapter |
| Authentication | Passport, JWT, bcrypt |
| Validation | class-validator, class-transformer |
| Documentation | Swagger, OpenAPI |
| Testing | Jest, Supertest |
| Deployment | Node.js 20, Vercel serverless functions |

## Main API areas

| Area | Route prefix | Purpose |
|---|---|---|
| Authentication | `/auth` | Sign-in, verification, refresh, logout, and password recovery |
| Employees | `/employees` | Employee records, filters, analytics, and attrition prediction |
| Users | `/users` | Administrative user-account management |
| Lookups | `/lookups` | Reference data used by the frontend |
| Attendance | `/attendance` | Presence and attendance history |
| Vacations | `/vacations` | Requests and approval workflows |

Protected routes expect an access token:

```http
Authorization: Bearer <access-token>
```

## Getting started

### Prerequisites

- Node.js 20
- npm
- PostgreSQL

### Installation

```bash
git clone https://github.com/malaz22mm/hr-back.git
cd hr-back
npm install
cp .env.example .env
```

Generate the Prisma client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run start:dev
```

The API runs at `http://localhost:3000` by default.

## Environment configuration

Never commit a real `.env` file. Copy `.env.example` and replace its placeholder values locally.

| Variable | Purpose |
|---|---|
| `DB_HOST` | PostgreSQL host |
| `DB_USERNAME` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_DATABASE` | PostgreSQL database name |
| `DB_PORT` | PostgreSQL port |
| `AT_SECRET` | Access-token signing secret |
| `RT_SECRET` | Refresh-token signing secret |
| `EMAIL_HOST` | SMTP host for verification messages |
| `EMAIL_PORT` | SMTP port |
| `EMAIL_USER` | SMTP username and sender |
| `EMAIL_PASSWORD` | SMTP password or application password |
| `PORT` | Optional local server port; defaults to `3000` |

## API documentation

With the server running:

- OpenAPI UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs-json`
- Static specification: [`swagger-spec.json`](./swagger-spec.json)
- Complete endpoint reference: [`COMPLETE_API_REFERENCE.md`](./COMPLETE_API_REFERENCE.md)

## Useful commands

```bash
npm run start:dev   # Start in watch mode
npm run build       # Generate Prisma client and compile the app
npm run lint        # Run ESLint with fixes
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:cov    # Generate a coverage report
```

## Architecture

The codebase follows NestJS feature modules, with shared authentication guards, decorators, validation, and Prisma access. The main domains are separated into authentication, employees, users, lookups, attendance, vacations, and machine-learning integration.

For deployment and deeper technical context, see:

- [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md)
- [`BACKEND_AUTH_SYSTEM.md`](./BACKEND_AUTH_SYSTEM.md)
- [`BACKEND_DEPLOYMENT_GUIDE.md`](./BACKEND_DEPLOYMENT_GUIDE.md)
- [`ML_INTEGRATION_GUIDE.md`](./ML_INTEGRATION_GUIDE.md)

## Dataset notice

The analytics and demonstration data are derived from the public [IBM HR Analytics Employee Attrition & Performance dataset](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset) and extended with synthetic fields for development and experimentation.

## Status

This project is under active development. Planned engineering improvements include expanded automated testing, rate limiting for authentication routes, consolidated database configuration, and structured production logging.

## Author

Developed by [Malaz Solieman](https://github.com/malaz22mm).


