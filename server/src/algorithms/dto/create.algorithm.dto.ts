import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAlgorithmDTO {
  @IsString()
  @Length(1, 50)
  @ApiProperty({
    example: 'Ant Colony Optimization',
    description: 'The unique name of the algorithm (e.g., Greedy, ACO)',
  })
  name: string;

  @IsString()
  @Length(1, 1000)
  @ApiProperty({
    example:
      'A meta-heuristic algorithm inspired by the foraging behavior of ants.',
    description: 'A detailed description of how the algorithm works',
  })
  description: string;
}
