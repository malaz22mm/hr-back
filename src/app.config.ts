import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Express, Request, Response } from 'express';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'https://hrdashboardai.netlify.app',
]);

const SWAGGER_UI_CDN = 'https://unpkg.com/swagger-ui-dist@5.30.2';

function setupVercelSwaggerUi(app: INestApplication): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Talabaty Backend API</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN}/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-bundle.js"></script>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        url: '/docs-json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout',
      });
    };
  </script>
</body>
</html>`;

  const instance = app.getHttpAdapter().getInstance() as Express;
  const serveHtml = (_req: Request, res: Response) => {
    res.type('text/html').send(html);
  };

  instance.get('/docs', serveHtml);
  instance.get('/docs/', serveHtml);
  instance.get('/docs/index.html', serveHtml);
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
    .setTitle('Talabaty HR Backend API')
    .setDescription(
      'HR analytics, employees, attendance, vacations, and admin auth. ' +
        'Protected routes require `Authorization: Bearer <access_token>`. ' +
        'Refresh via POST /auth/refresh with the refresh token in the same header.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token from POST /auth/local/signin or /auth/verify',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const isVercel = Boolean(process.env.VERCEL);

  // Must NOT use /api/docs — Vercel reserves /api/* for the api/ serverless folder (404 NOT_FOUND)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Talabaty Backend API',
    jsonDocumentUrl: 'docs-json',
    ui: !isVercel,
    raw: isVercel ? ['json'] : true,
  });

  if (isVercel) {
    setupVercelSwaggerUi(app);
  }

  console.log('[Bootstrap] Swagger UI: /docs');
  console.log('[Bootstrap] OpenAPI JSON: /docs-json');

  if (!isVercel) {
    try {
      const fs = await import('fs');
      fs.writeFileSync('swagger-spec.json', JSON.stringify(document));
    } catch (error) {
      console.warn('[Bootstrap] Could not write swagger-spec.json:', error);
    }
  }

  console.log('[Bootstrap] Application configuration complete');
}
