import { Injectable, NotImplementedException } from '@nestjs/common';
import {
  CreateHistoricPlaceDTO,
  ReadAllHistoricPlacesDTO,
  ReadAllHistoricPlacesQueryDTO,
  ReadHistoricPlaceDTO,
} from './dto';

@Injectable()
export class HistoricPlacesService {
  getAll(
    query: ReadAllHistoricPlacesQueryDTO,
  ): Promise<ReadAllHistoricPlacesDTO> {
    throw new NotImplementedException(
      `Method is not implemented ${JSON.stringify(query)}`,
    );
  }

  getOne(historicPlaceId: string): Promise<ReadHistoricPlaceDTO> {
    throw new NotImplementedException(
      `Method is not implemented ${historicPlaceId}`,
    );
  }

  create(data: CreateHistoricPlaceDTO): Promise<string> {
    throw new NotImplementedException(
      `Method is not implemented ${JSON.stringify(data)}`,
    );
  }

  update(historicPlaceId: string, data: CreateHistoricPlaceDTO): Promise<void> {
    console.log(data);
    throw new NotImplementedException(
      `Method is not implemented ${historicPlaceId}`,
    );
  }

  delete(historicPlaceId: string): Promise<void> {
    throw new NotImplementedException(
      `Method is not implemented ${historicPlaceId}`,
    );
  }
}
