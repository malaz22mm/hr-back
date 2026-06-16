import { Injectable } from '@nestjs/common';
import { MlAttritionFeatures, MlPredictionResult } from './ml-feature.types';
import { OnnxPredictorService } from './onnx-predictor.service';
import { PythonPredictorService } from './python-predictor.service';

@Injectable()
export class MlPredictorService {
  constructor(
    private readonly onnxPredictor: OnnxPredictorService,
    private readonly pythonPredictor: PythonPredictorService,
  ) {}

  predict(features: MlAttritionFeatures): Promise<MlPredictionResult> {
    const backend = (process.env.ML_BACKEND || 'onnx').toLowerCase();
    if (backend === 'python') {
      return this.pythonPredictor.predict(features);
    }
    return this.onnxPredictor.predict(features);
  }
}
