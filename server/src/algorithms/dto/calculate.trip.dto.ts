import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAlgorithmParametersDTO } from './create.algorithm-parameters.dto';

export class CalculateTripDto {
  @IsUUID(4)
  @ApiProperty({
    example: '2f7ff53e-e676-49d7-bb5d-48faf7ea4500',
    description: 'UUID of the selected algorithm',
  })
  algorithmId: string;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAlgorithmParametersDTO)
  @ApiPropertyOptional({
    type: CreateAlgorithmParametersDTO,
    description: 'Optional configuration for Ant Colony Optimization',
  })
  parameters?: CreateAlgorithmParametersDTO;
}
