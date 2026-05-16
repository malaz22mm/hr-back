import type { VercelRequest, VercelResponse } from '@vercel/node';

declare module '../dist/src/serverless' {
  const handler: (
    req: VercelRequest,
    res: VercelResponse,
  ) => void | Promise<void>;
  export default handler;
}
