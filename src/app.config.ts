import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'https://hrdashboardai.netlify.app',
]);

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

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || ALLOWED_ORIGINS.has(origin)) {
        callback(null, true);
        return;
      }
      console.warn(`[Bootstrap] CORS blocked origin: ${origin}`);
      callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  console.log('[Bootstrap] Initializing Swagger...');
  const config = new DocumentBuilder()
    .setTitle('Talabaty Backend Documentation')
    .setDescription("Endpoints' description")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Must NOT use /api/docs — Vercel reserves /api/* for the api/ serverless folder (404 NOT_FOUND)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Talabaty Backend API',
    jsonDocumentUrl: 'docs-json',
  });
  console.log('[Bootstrap] Swagger UI: /docs');
  console.log('[Bootstrap] OpenAPI JSON: /docs-json');

  try {
    const fs = await import('fs');
    fs.writeFileSync('swagger-spec.json', JSON.stringify(document));
  } catch (error) {
    console.warn('[Bootstrap] Could not write swagger-spec.json:', error);
  }

  console.log('[Bootstrap] Application configuration complete');
}
