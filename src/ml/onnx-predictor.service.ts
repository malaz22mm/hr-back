import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ort from 'onnxruntime-node';
import { MlAttritionFeatures, MlPredictionResult } from './ml-feature.types';
import { MlPreprocessorService } from './ml-preprocessor.service';

@Injectable()
export class OnnxPredictorService implements OnModuleInit {
  private session: ort.InferenceSession | null = null;

  constructor(private readonly preprocessor: MlPreprocessorService) {}

  async onModuleInit(): Promise<void> {
    const modelPath = path.join(process.cwd(), 'models', 'classifier_v1.onnx');
    if (!fs.existsSync(modelPath)) {
      console.warn(`[ML] ONNX model not found at ${modelPath}`);
      return;
    }
    this.session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['cpu'],
    });
    console.log('[ML] ONNX classifier session loaded');
  }

  async predict(features: MlAttritionFeatures): Promise<MlPredictionResult> {
    if (!this.session) {
      throw new ServiceUnavailableException('ML model is not loaded');
    }

    const vector = this.preprocessor.transform(features);
    const inputName = this.session.inputNames[0];
    const tensor = new ort.Tensor('float32', vector, [1, vector.length]);
    const outputs = await this.session.run({ [inputName]: tensor });

    if (outputs.probabilities instanceof ort.Tensor) {
      const data = outputs.probabilities.data as Float32Array;
      if (data.length >= 2) {
        return {
          predictedAttrition: data[1] >= 0.5,
          attritionProbability: Math.round(Number(data[1]) * 1_000_000) / 1_000_000,
          modelVersion: this.preprocessor.modelVersion,
        };
      }
    }

    const probability = this.extractPositiveClassProbability(outputs);
    return {
      predictedAttrition: probability >= 0.5,
      attritionProbability: Math.round(probability * 1_000_000) / 1_000_000,
      modelVersion: this.preprocessor.modelVersion,
    };
  }

  private extractPositiveClassProbability(
    outputs: ort.InferenceSession.OnnxValueMapType,
  ): number {
    const tensors = Object.values(outputs);
    for (const value of tensors) {
      if (!(value instanceof ort.Tensor)) {
        continue;
      }
      const data = value.data as Float32Array | number[];
      if (data.length === 2) {
        return Number(data[1]);
      }
      if (data.length === 1) {
        return Number(data[0]);
      }
    }
    throw new ServiceUnavailableException('Unexpected ONNX model output shape');
  }
}
