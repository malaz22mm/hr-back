import { Module } from '@nestjs/common';
import { AttendanceMetricsService } from './attendance-metrics.service';
import { AttritionPredictionService } from './attrition-prediction.service';
import { FeatureAssemblyService } from './feature-assembly.service';
import { MlPredictorService } from './ml-predictor.service';
import { MlPreprocessorService } from './ml-preprocessor.service';
import { PythonPredictorService } from './python-predictor.service';
import { VacationMetricsService } from './vacation-metrics.service';
import { XgboostJsonPredictorService } from './xgboost-json-predictor.service';

@Module({
  providers: [
    MlPreprocessorService,
    XgboostJsonPredictorService,
    PythonPredictorService,
    MlPredictorService,
    AttendanceMetricsService,
    VacationMetricsService,
    FeatureAssemblyService,
    AttritionPredictionService,
  ],
  exports: [AttritionPredictionService],
})
export class MlModule {}
