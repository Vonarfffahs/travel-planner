import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAlgorithmParametersDTO {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 1.0,
    description:
      'Alpha (Pheromone importance weight). Typically between 0 and 5.',
  })
  alpha?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 3.0,
    description:
      'Beta (Heuristic importance weight). Typically between 1 and 5.',
  })
  beta?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    example: 0.5,
    description: 'Evaporation rate (Rho). Must be between 0 and 1.',
  })
  evaporationRate?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 50,
    description: 'Number of iterations for the simulation',
  })
  iterations?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 20,
    description: 'Number of ants (agents) per iteration',
  })
  antCount?: number;
}
