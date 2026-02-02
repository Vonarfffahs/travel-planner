import { ApiProperty } from '@nestjs/swagger';
import { ReadAlgorithmDTO } from './read.algorithm.dto';

export class ReadAllAlgorithmsDTO {
  @ApiProperty({
    example: 2,
    description: 'Total count of records found',
  })
  count: number;

  @ApiProperty({
    type: [ReadAlgorithmDTO],
    description: 'List of algorithms',
  })
  data: ReadAlgorithmDTO[];
}
