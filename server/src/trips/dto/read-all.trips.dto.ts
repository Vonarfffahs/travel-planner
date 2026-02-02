import { ApiProperty } from '@nestjs/swagger';
import { ReadTripDTO } from './read.trip.dto';

export class ReadAllTripsDTO {
  @ApiProperty({
    example: 5,
    description: 'Total count of trips',
  })
  count: number;

  @ApiProperty({
    type: [ReadTripDTO],
    description: 'List of trips',
  })
  data: ReadTripDTO[];
}
