import { ApiProperty } from '@nestjs/swagger';

export class ReadAlgorithmParametersDTO {
  @ApiProperty({
    example: '22035711-632b-4972-99c6-2848e52a1907',
    description: 'ID of the parameters set',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: 'Pheromone importance (Alpha)',
    nullable: true,
  })
  alpha: number | null;

  @ApiProperty({
    example: 3,
    description: 'Heuristic importance (Beta)',
    nullable: true,
  })
  beta: number | null;

  @ApiProperty({
    example: 0.5,
    description: 'Pheromone evaporation rate (Rho)',
    nullable: true,
  })
  evaporationRate: number | null;

  @ApiProperty({
    example: 100,
    description: 'Number of iterations',
    nullable: true,
  })
  iterations: number | null;

  @ApiProperty({
    example: 20,
    description: 'Number of ants per iteration',
    nullable: true,
  })
  antCount: number | null;
}
