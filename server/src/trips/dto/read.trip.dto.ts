import { ReadAlgorithmDTO } from 'src/algorithms/dto';
import { ReadAlgorithmParametersDTO } from './read.algorithm-parameters.dto';
import { ReadTripStepDTO } from './read.trip-step.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReadTripDTO {
  @ApiProperty({
    example: '5417acea-28ff-4ae1-8b55-768c12bf784e',
    description: 'Trip UUID',
  })
  id: string;

  @ApiProperty({
    example: 'Summer Trip to Italy',
    description: 'Name of the trip',
  })
  name: string;

  @ApiProperty({
    example: 1000,
    description: 'Maximum cost constraint (C)',
  })
  maxCostLimit: number; // C

  @ApiProperty({
    example: 7,
    description: 'Maximum time constraint in days (D)',
  })
  maxTimeLimit: number; // D

  @ApiProperty({
    example: 22.6,
    description: 'Total historic value collected (Objective Function)',
  })
  totalValue: number;

  @ApiProperty({
    example: 35.5,
    description: 'Total cost of the trip',
  })
  totalCost: number;

  @ApiProperty({
    example: 5,
    description: 'Total duration of the trip',
  })
  totalTime: number;

  @ApiProperty({
    example: 6.72,
    description: 'Time taken to calculate the route in ms',
  })
  calculationTime: number;

  @ApiProperty({
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
    description: 'User UUID',
  })
  userId: string;

  @ApiProperty({
    type: ReadAlgorithmParametersDTO,
    nullable: true,
    description: 'Parameters used (if ACO)',
  })
  parameters: ReadAlgorithmParametersDTO | null;

  @ApiProperty({
    type: [ReadTripStepDTO],
    description: 'Ordered list of places to visit',
  })
  tripSteps: ReadTripStepDTO[];

  @ApiProperty({
    type: ReadAlgorithmDTO,
    description: 'Algorithm used for calculation',
  })
  algorithm: ReadAlgorithmDTO;
}
