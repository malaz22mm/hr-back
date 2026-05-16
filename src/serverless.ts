import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './app.config';

let cachedServer: Express | null = null;
let initPromise: Promise<Express> | null = null;

async function createNestServer(): Promise<Express> {
  console.log('[Serverless] Cold start: creating Nest application...');
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  console.log('[Serverless] AppModule created');

  await configureApp(app);
  await app.init();
  console.log('[Serverless] Bootstrap complete — Nest is ready');

  return server;
}

export async function getServer(): Promise<Express> {
  if (cachedServer) {
    console.log('[Serverless] Reusing cached Express server');
    return cachedServer;
  }

  if (!initPromise) {
    initPromise = createNestServer()
      .then((server) => {
        cachedServer = server;
        return server;
      })
      .catch((error) => {
        initPromise = null;
        console.error('[Serverless] Initialization failure:', error);
        throw error;
      });
  }

  return initPromise;
}

async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  console.log(`[Serverless] Request: ${req.method} ${req.url}`);
  try {
    const server = await getServer();
    server(req, res);
  } catch (error) {
    console.error('[Serverless] Request handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default handler;
