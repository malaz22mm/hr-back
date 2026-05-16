import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './main';

let cachedServer: Express | null = null;

export async function getServer(): Promise<Express> {
  if (cachedServer) {
    console.log('[Serverless] Reusing cached Express server');
    return cachedServer;
  }

  console.log('[Serverless] Cold start: creating Nest application...');
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  console.log('[Serverless] AppModule created');

  await configureApp(app);
  await app.init();
  console.log('[Serverless] Nest application initialized');

  cachedServer = server;
  return server;
}
