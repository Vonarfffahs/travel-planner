import { ApiProperty } from '@nestjs/swagger';
import { ReadHistoricPlaceDTO } from './read.historic-place.dto';

export class ReadAllHistoricPlacesDTO {
  @ApiProperty({
    example: 10,
    description: 'Total number of historic places found',
  })
  count: number;

  @ApiProperty({
    type: [ReadHistoricPlaceDTO],
    description: 'List of historic places',
  })
  data: ReadHistoricPlaceDTO[];
}
