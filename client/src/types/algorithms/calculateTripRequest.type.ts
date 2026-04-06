import type { CreateAlgorithmParameters } from './createAlgorithmParameters.type';

export interface CalculateTripRequest {
  algorithmId: string;
  maxCostLimit: number;
  maxTimeLimit: number;
  parameters?: CreateAlgorithmParameters;
}
