import { IsUUID } from 'class-validator';

export class GetHistoricPlaceParams {
  @IsUUID(4)
  historicPlaceId: string;
}
