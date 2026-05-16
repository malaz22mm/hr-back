import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

const SAFE_ENV_KEYS = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_DATABASE',
  'DB_PORT',
  'DB_USERNAME',
] as const;

function loadLocalEnv(): void {
  dotenv.config({ quiet: true });
}

function logStartupEnv(): void {
  console.log('[Bootstrap] Environment variables (safe subset):');
  for (const key of SAFE_ENV_KEYS) {
    console.log(`[Bootstrap]   ${key}=${process.env[key] ?? '(not set)'}`);
  }
  console.log(
    `[Bootstrap]   DATABASE_URL=${process.env.DATABASE_URL ? '(set)' : '(not set)'}`,
  );
  console.log(
    `[Bootstrap]   AT_SECRET=${process.env.AT_SECRET ? '(set)' : '(not set)'}`,
  );
  console.log(
    `[Bootstrap]   RT_SECRET=${process.env.RT_SECRET ? '(set)' : '(not set)'}`,
  );
}

async function bootstrap(): Promise<void> {
  loadLocalEnv();

  console.log('[Bootstrap] Starting NestJS (local development)...');
  logStartupEnv();

  const port = Number(process.env.PORT) || 3000;
  console.log(`[Bootstrap] Target port: ${port}`);

  const app = await NestFactory.create(AppModule);
  console.log('[Bootstrap] AppModule loaded');

  await configureApp(app);

  await app.listen(port);
  console.log(`[Bootstrap] Server listening on http://localhost:${port}`);
}

const isDirectRun =
  typeof require !== 'undefined' && require.main === module;

if (isDirectRun) {
  bootstrap().catch((error) => {
    console.error('[Bootstrap] Fatal startup error:', error);
    process.exit(1);
  });
}
