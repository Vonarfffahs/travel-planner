import { ReadAlgorithmParametersDTO } from './read.algorithm-parameters.dto';
import { ReadTripStepDTO } from './read.trip-step.dto';

export class ReadAlgorithmDTO {
  id: string;
  name: string;
  description?: string | null;
}

export class ReadTripDTO {
  id: string;

  name: string;

  maxCostLimit: number; // C

  maxTimeLimit: number; // D

  totalValue: number;

  totalCost: number;

  totalTime: number;

  calculationTime: number;

  userId: string;

  parameters: ReadAlgorithmParametersDTO | null;

  tripSteps: ReadTripStepDTO[];

  algorithm: ReadAlgorithmDTO;
}
