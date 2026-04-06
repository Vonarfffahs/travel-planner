import type { CalculatedPlacesPath } from './calculatedPlacesPath.type';
import type { CreateAlgorithmParameters } from './createAlgorithmParameters.type';

export interface CalculateTripResponse {
  algorithmId: string;
  algorithmName: string;
  totalValue: number;
  totalCost: number;
  totalTime: number;
  calculationTime: number;
  path: CalculatedPlacesPath[];
  parameters: CreateAlgorithmParameters | null;
}
