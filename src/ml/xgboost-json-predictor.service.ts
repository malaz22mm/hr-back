import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MlAttritionFeatures, MlPredictionResult } from './ml-feature.types';
import { MlPreprocessorService } from './ml-preprocessor.service';

interface XgbTree {
  left_children: number[];
  right_children: number[];
  split_indices: number[];
  split_conditions: number[];
  base_weights: number[];
}

interface XgbModelJson {
  learner: {
    learner_model_param: { base_score?: string };
    gradient_booster: {
      model: {
        trees: XgbTree[];
      };
    };
  };
}

@Injectable()
export class XgboostJsonPredictorService implements OnModuleInit {
  private trees: XgbTree[] = [];
  private modelVersion = 'attrition-xgb-v1';

  constructor(private readonly preprocessor: MlPreprocessorService) {}

  onModuleInit(): void {
    const modelPath = path.join(process.cwd(), 'models', 'classifier.json');
    const metaPath = path.join(process.cwd(), 'models', 'classifier.meta.json');

    if (!fs.existsSync(modelPath)) {
      console.warn(`[ML] XGBoost JSON model not found at ${modelPath}`);
      return;
    }

    const model = JSON.parse(
      fs.readFileSync(modelPath, 'utf-8'),
    ) as XgbModelJson;
    this.trees = model.learner.gradient_booster.model.trees;

    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as {
        modelVersion?: string;
      };
      this.modelVersion = meta.modelVersion ?? this.modelVersion;
    }

    console.log(`[ML] XGBoost JSON model loaded (${this.trees.length} trees)`);
  }

  predict(features: MlAttritionFeatures): MlPredictionResult {
    if (this.trees.length === 0) {
      throw new ServiceUnavailableException('ML model is not loaded');
    }

    const vector = this.preprocessor.transform(features);
    let margin = 0;

    for (const tree of this.trees) {
      margin += this.traverseTree(tree, vector);
    }

    const probability = this.sigmoid(margin);

    return {
      predictedAttrition: probability >= 0.5,
      attritionProbability: Math.round(probability * 1_000_000) / 1_000_000,
      modelVersion: this.modelVersion,
    };
  }

  private traverseTree(tree: XgbTree, features: Float32Array): number {
    let node = 0;

    while (tree.left_children[node] !== -1) {
      const featureIndex = tree.split_indices[node];
      const featureValue = features[featureIndex];
      const threshold = tree.split_conditions[node];
      const goLeft = featureValue < threshold;
      node = goLeft ? tree.left_children[node] : tree.right_children[node];
    }

    return tree.base_weights[node];
  }

  private sigmoid(margin: number): number {
    if (margin >= 0) {
      const z = Math.exp(-margin);
      return 1 / (1 + z);
    }
    const z = Math.exp(margin);
    return z / (1 + z);
  }
}
