import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAlgorithmParametersDTO } from '../../algorithms/dto/create.algorithm-parameters.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiPropertyOptional({
    example: 'Summer Trip to Greece',
    description: 'A custom name for the trip',
  })
  name?: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 1500,
    description: 'Maximum financial budget for the trip (Constraint C)',
  })
  maxCostLimit: number; // C

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 7,
    description: 'Maximum available time in days (Constraint D)',
  })
  maxTimeLimit: number; // D

  @IsUUID(4)
  @ApiProperty({
    example: '2f7ff53e-e676-49d7-bb5d-48faf7ea4500',
    description: 'UUID of the selected algorithm',
  })
  algorithmId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAlgorithmParametersDTO)
  @ApiPropertyOptional({
    type: CreateAlgorithmParametersDTO,
    description: 'Optional configuration for Ant Colony Optimization',
  })
  parameters?: CreateAlgorithmParametersDTO;

  @IsUUID(4)
  @ApiProperty({
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
    description: 'UUID of the user creating the trip',
  })
  userId: string;

  @IsNumber()
  @ApiProperty({
    example: 85.5,
    description: 'Total historic value of the calculated trip',
  })
  totalValue: number;

  @IsNumber()
  @ApiProperty({
    example: 1200,
    description: 'Total cost of the calculated trip',
  })
  totalCost: number;

  @IsNumber()
  @ApiProperty({
    example: 6,
    description: 'Total time of the calculated trip',
  })
  totalTime: number;

  @IsNumber()
  @ApiProperty({
    example: 15.4,
    description: 'Time taken by the algorithm to calculate (ms)',
  })
  calculationTime: number;

  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  @ApiProperty({
    example: ['uuid-1', 'uuid-2'],
    description:
      'Array of historic place IDs in the exact order they should be visited',
  })
  path: string[];
}
