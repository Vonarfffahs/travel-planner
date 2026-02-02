import { HistoricPlace } from 'generated/prisma/client';
import { ReadAllHistoricPlacesDTO, ReadHistoricPlaceDTO } from '../dto';

export class ReadHistoricPlaceMapper {
  public mapOne(historicPlace: HistoricPlace): ReadHistoricPlaceDTO {
    return {
      id: historicPlace.id,
      name: historicPlace.name,
      coordX: historicPlace.coordX,
      coordY: historicPlace.coordY,
      historicValue: historicPlace.historicValue,
      daysToVisit: historicPlace.daysToVisit,
    };
  }

  public mapMany(
    count: number,
    data: HistoricPlace[],
  ): ReadAllHistoricPlacesDTO {
    return {
      count,
      data: data.map((one) => this.mapOne(one)),
    };
  }
}
