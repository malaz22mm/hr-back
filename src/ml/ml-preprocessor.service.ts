import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  MlAttritionFeatures,
  PreprocessorConfig,
} from './ml-feature.types';

@Injectable()
export class MlPreprocessorService implements OnModuleInit {
  private config!: PreprocessorConfig;

  onModuleInit(): void {
    const configPath = path.join(
      process.cwd(),
      'models',
      'preprocessor_config.json',
    );
    this.config = JSON.parse(
      fs.readFileSync(configPath, 'utf-8'),
    ) as PreprocessorConfig;
  }

  get modelVersion(): string {
    return this.config.modelVersion;
  }

  transform(features: MlAttritionFeatures): Float32Array {
    const scaled = this.config.numericalColumns.map((col, index) => {
      const value = features[col] ?? 0;
      const mean = this.config.scalerMean[index];
      const scale = this.config.scalerScale[index] || 1;
      return (value - mean) / scale;
    });

    const encoded: number[] = [];
    for (const col of this.config.categoricalColumns) {
      const categories = this.config.oneHotCategories[col] ?? [];
      const value = features[col] ?? categories[0] ?? 0;
      encoded.push(...this.encodeOneHotDropFirst(value, categories));
    }

    return Float32Array.from([...scaled, ...encoded]);
  }

  private encodeOneHotDropFirst(value: number, categories: number[]): number[] {
    if (categories.length <= 1) {
      return [];
    }

    const output = new Array(categories.length - 1).fill(0);
    const index = categories.indexOf(value);
    if (index > 0) {
      output[index - 1] = 1;
    }
    return output;
  }
}
