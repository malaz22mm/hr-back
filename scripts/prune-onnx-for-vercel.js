/**
 * Vercel serverless functions have a 250 MB unzipped limit.
 * onnxruntime-node ships binaries for win32, darwin, and linux/arm64 (~215 MB extra).
 * On Vercel we only need linux/x64 (~38 MB).
 */
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
  console.log('[prune-onnx] Skipped (local build — all platforms kept for dev)');
  process.exit(0);
}

const binRoot = path.join(
  __dirname,
  '..',
  'node_modules',
  'onnxruntime-node',
  'bin',
  'napi-v6',
);

if (!fs.existsSync(binRoot)) {
  console.warn('[prune-onnx] onnxruntime-node bin folder not found');
  process.exit(0);
}

const toRemove = [
  path.join(binRoot, 'darwin'),
  path.join(binRoot, 'win32'),
  path.join(binRoot, 'linux', 'arm64'),
];

for (const target of toRemove) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('[prune-onnx] Removed', path.relative(binRoot, target));
  }
}

console.log('[prune-onnx] Done — kept linux/x64 only');
