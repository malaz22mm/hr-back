import type { VercelRequest, VercelResponse } from '@vercel/node';

type ServerlessHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<void>;

let handlerPromise: Promise<ServerlessHandler> | null = null;

async function loadHandler(): Promise<ServerlessHandler> {
  const mod = (await import('../dist/src/serverless.js')) as {
    default: ServerlessHandler;
  };
  if (typeof mod.default !== 'function') {
    throw new Error(
      'dist/src/serverless.js must export a default async function handler',
    );
  }
  return mod.default;
}

export default async function vercelEntry(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    if (!handlerPromise) {
      console.log('[Vercel] Loading serverless handler from dist...');
      handlerPromise = loadHandler();
    }
    const handler = await handlerPromise;
    await handler(req, res);
  } catch (error) {
    console.error('[Vercel] Entrypoint error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
