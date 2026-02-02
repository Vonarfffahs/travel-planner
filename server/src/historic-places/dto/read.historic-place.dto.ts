import { ApiProperty } from '@nestjs/swagger';

export class ReadHistoricPlaceDTO {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Unique identifier of the historic place',
  })
  id: string;

  @ApiProperty({
    example: 'Colosseum',
    description: 'Name of the historic place',
  })
  name: string;

  @ApiProperty({
    example: 41.8902,
    description: 'X Coordinate (Latitude)',
  })
  coordX: number; // x_j

  @ApiProperty({
    example: 12.4922,
    description: 'Y Coordinate (Longitude)',
  })
  coordY: number; // y_j

  @ApiProperty({
    example: 10,
    description: 'Historical value (Weight w_j)',
  })
  historicValue: number; // w_j

  @ApiProperty({
    example: 1,
    description: 'Time required to visit in days (d_j)',
  })
  daysToVisit: number; // d_j
}
