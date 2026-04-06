import type { CreateAlgorithmParameters } from '../algorithms';

export interface CreateTripRequest {
  name: string;
  maxCostLimit: number;
  maxTimeLimit: number;
  algorithmId: string;
  parameters?: CreateAlgorithmParameters;
  userId: string;
  totalValue: number;
  totalCost: number;
  totalTime: number;
  calculationTime: number;
  path: string[];
}
