import { ApiProperty } from '@nestjs/swagger';

export class AttritionPredictionResponseDto {
  @ApiProperty({ example: 42 })
  employeeId: number;

  @ApiProperty({ example: 'John Martinez' })
  employeeName: string;

  @ApiProperty({ example: false })
  predictedAttrition: boolean;

  @ApiProperty({ example: 0.23, description: 'Probability of attrition (0-1)' })
  attritionProbability: number;

  @ApiProperty({ example: 'Low', enum: ['Low', 'Medium', 'High'] })
  riskLevel: 'Low' | 'Medium' | 'High';

  @ApiProperty({ example: 1 })
  suggestedAttritionRiskClassId: number;

  @ApiProperty({ example: 'attrition-xgb-v1' })
  modelVersion: string;

  @ApiProperty({ example: '2026-06-16T12:00:00.000Z' })
  computedAt: string;
}
