import { Injectable } from '@nestjs/common';
import { MlAttritionFeatures, MlPredictionResult } from './ml-feature.types';
import { PythonPredictorService } from './python-predictor.service';
import { XgboostJsonPredictorService } from './xgboost-json-predictor.service';

@Injectable()
export class MlPredictorService {
  constructor(
    private readonly xgboostPredictor: XgboostJsonPredictorService,
    private readonly pythonPredictor: PythonPredictorService,
  ) {}

  predict(features: MlAttritionFeatures): Promise<MlPredictionResult> {
    const backend = (process.env.ML_BACKEND || 'js').toLowerCase();

    if (backend === 'python') {
      return this.pythonPredictor.predict(features);
    }

    return Promise.resolve(this.xgboostPredictor.predict(features));
  }
}
