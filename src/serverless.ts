import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { AppModule } from './app.module';
import { configureApp } from './main';

let cachedServer: Express | null = null;

export async function getServer(): Promise<Express> {
  if (cachedServer) return cachedServer;

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await configureApp(app);
  await app.init();

  cachedServer = server;
  return server;
}

