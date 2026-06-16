import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { MlAttritionFeatures, MlPredictionResult } from './ml-feature.types';

@Injectable()
export class PythonPredictorService {
  private readonly scriptPath = path.join(
    process.cwd(),
    'data.mining',
    'predict.py',
  );

  async predict(features: MlAttritionFeatures): Promise<MlPredictionResult> {
    const pythonCmd = process.env.PYTHON_PATH || 'python';
    const payload = JSON.stringify({ features });

    return new Promise((resolve, reject) => {
      const child = spawn(pythonCmd, [this.scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on('error', (error) => {
        reject(
          new ServiceUnavailableException(
            `Python predictor failed to start: ${error.message}`,
          ),
        );
      });

      child.on('close', (code) => {
        if (code !== 0) {
          reject(
            new ServiceUnavailableException(
              stderr || `Python predictor exited with code ${code}`,
            ),
          );
          return;
        }
        try {
          const parsed = JSON.parse(stdout) as MlPredictionResult;
          resolve(parsed);
        } catch {
          reject(
            new ServiceUnavailableException(
              'Python predictor returned invalid JSON',
            ),
          );
        }
      });

      child.stdin.write(payload);
      child.stdin.end();
    });
  }
}
