import { ReadHistoricPlaceDTO } from 'src/historic-places/dto';

export class ReadTripStepDTO {
  id: string;
  visitOrder: number;
  historicPlace: ReadHistoricPlaceDTO;
}
