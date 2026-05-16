import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServer } from '../dist/src/serverless';

let serverPromise: ReturnType<typeof getServer> | null = null;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  try {
    if (!serverPromise) {
      console.log('[Vercel] Initializing server (cold start)...');
      serverPromise = getServer();
    }
    const server = await serverPromise;
    return server(req, res);
  } catch (error) {
    console.error('[Vercel] Request handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
