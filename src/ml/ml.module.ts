import { Module } from '@nestjs/common';
import { AttendanceMetricsService } from './attendance-metrics.service';
import { AttritionPredictionService } from './attrition-prediction.service';
import { FeatureAssemblyService } from './feature-assembly.service';
import { MlPredictorService } from './ml-predictor.service';
import { MlPreprocessorService } from './ml-preprocessor.service';
import { OnnxPredictorService } from './onnx-predictor.service';
import { PythonPredictorService } from './python-predictor.service';
import { VacationMetricsService } from './vacation-metrics.service';

@Module({
  providers: [
    MlPreprocessorService,
    OnnxPredictorService,
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
