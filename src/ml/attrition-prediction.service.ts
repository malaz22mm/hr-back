import { Injectable } from '@nestjs/common';
import { mapProbabilityToRiskLevel } from './ml-feature.mapper';
import { FeatureAssemblyService } from './feature-assembly.service';
import { MlPredictorService } from './ml-predictor.service';

@Injectable()
export class AttritionPredictionService {
  constructor(
    private readonly featureAssembly: FeatureAssemblyService,
    private readonly predictor: MlPredictorService,
  ) {}

  async predictForEmployee(employeeId: number) {
    const { employeeName, features } =
      await this.featureAssembly.assemble(employeeId);
    const prediction = await this.predictor.predict(features);
    const risk = mapProbabilityToRiskLevel(prediction.attritionProbability);

    return {
      employeeId,
      employeeName,
      predictedAttrition: prediction.predictedAttrition,
      attritionProbability: prediction.attritionProbability,
      riskLevel: risk.riskLevel,
      suggestedAttritionRiskClassId: risk.suggestedAttritionRiskClassId,
      modelVersion: prediction.modelVersion,
      computedAt: new Date().toISOString(),
    };
  }
}
