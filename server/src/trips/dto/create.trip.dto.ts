import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAlgorithmParametersDTO } from './create.algorithm-parameters.dto';
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
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
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
}
