import type { Algorithm, AlgorithmParameters } from '../algorithms';
import type { TripStep } from './tripStep.type';

export interface Trip {
  id: string;
  name: string;
  maxCostLimit: number;
  maxTimeLimit: number;
  totalValue: number;
  totalCost: number;
  totalTime: number;
  calculationTime: number;
  userId: string;
  parameters: AlgorithmParameters | null;
  tripSteps: TripStep[];
  algorithm: Algorithm;
}
