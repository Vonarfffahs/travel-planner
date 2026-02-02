import { ApiProperty } from '@nestjs/swagger';
import { ReadHistoricPlaceDTO } from 'src/historic-places/dto';

export class ReadTripStepDTO {
  @ApiProperty({
    example: '73bb1243-fc0d-482b-a737-6a507df39f43',
    description: 'Unique ID of the step',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: 'Order of visit in the route',
  })
  visitOrder: number;

  @ApiProperty({
    type: ReadHistoricPlaceDTO,
    description: 'The historic place details',
  })
  historicPlace: ReadHistoricPlaceDTO;
}
