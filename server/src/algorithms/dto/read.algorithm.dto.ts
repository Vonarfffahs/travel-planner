import { ApiProperty } from '@nestjs/swagger';

export class ReadAlgorithmDTO {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Unique identifier of the algorithm',
  })
  id: string;

  @ApiProperty({
    example: 'Ant Colony Optimization',
    description: 'Name of the algorithm',
  })
  name: string;

  @ApiProperty({
    example:
      'Heuristic algorithm based on the behavior of ants seeking a path between their colony and a source of food.',
    description: 'Short description of how the algorithm works',
  })
  description: string;

  @ApiProperty({
    example: '2026-04-15T11:46:27.210Z',
    description: 'Algorithm creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-04-15T11:46:27.210Z',
    description: 'Algorithm update date',
  })
  updatedAt: Date;
}
