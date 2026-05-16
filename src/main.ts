import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

const SAFE_ENV_KEYS = [
  'NODE_ENV',
  'PORT',
  'VERCEL',
  'DB_HOST',
  'DB_DATABASE',
  'DB_PORT',
  'DB_USERNAME',
] as const;

function logStartupEnv(): void {
  console.log('[Bootstrap] Environment variables (safe subset):');
  for (const key of SAFE_ENV_KEYS) {
    console.log(`[Bootstrap]   ${key}=${process.env[key] ?? '(not set)'}`);
  }
  console.log(
    `[Bootstrap]   DATABASE_URL=${process.env.DATABASE_URL ? '(set)' : '(not set)'}`,
  );
  console.log(
    `[Bootstrap]   JWT_AT_SECRET=${process.env.JWT_AT_SECRET ? '(set)' : '(not set)'}`,
  );
  console.log(
    `[Bootstrap]   JWT_RT_SECRET=${process.env.JWT_RT_SECRET ? '(set)' : '(not set)'}`,
  );
}

export async function configureApp(app: INestApplication): Promise<void> {
  console.log('[Bootstrap] Configuring global pipes, Swagger, and CORS...');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  console.log('[Bootstrap] Initializing Swagger...');
  const config = new DocumentBuilder()
    .setTitle('Talabaty Backend Documentation')
    .setDescription("Endpoints' description")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  console.log('[Bootstrap] Swagger available at /api/docs');

  if (!process.env.VERCEL) {
    try {
      const fs = await import('fs');
      fs.writeFileSync('swagger-spec.json', JSON.stringify(document));
      console.log('[Bootstrap] swagger-spec.json written');
    } catch (error) {
      console.warn('[Bootstrap] Could not write swagger-spec.json:', error);
    }
  }

  app.enableCors({
    origin: ['http://localhost:5173', 'https://hrdashboardai.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  console.log('[Bootstrap] Application configuration complete');
}

async function bootstrap(): Promise<void> {
  console.log('[Bootstrap] Starting NestJS application...');
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
  typeof require !== 'undefined' &&
  require.main === module;

if (isDirectRun) {
  bootstrap().catch((error) => {
    console.error('[Bootstrap] Fatal startup error:', error);
    process.exit(1);
  });
}
