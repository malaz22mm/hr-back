export type MlAttritionFeatures = Record<string, number>;

export interface AttendanceMetrics {
  overTimeHoursLastMonth: number;
  lateArrivalsLastMonth: number;
  absenceDaysLastMonth: number;
  absenceRatio: number;
}

export interface VacationMetrics {
  acceptedVacations: number;
  rejectedVacations: number;
}

export interface PreprocessorConfig {
  featureColumns: string[];
  categoricalColumns: string[];
  numericalColumns: string[];
  scalerMean: number[];
  scalerScale: number[];
  oneHotCategories: Record<string, number[]>;
  transformedFeatureCount: number;
  modelVersion: string;
}

export interface MlPredictionResult {
  predictedAttrition: boolean;
  attritionProbability: number;
  modelVersion: string;
}
