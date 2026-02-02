import { IsUUID } from 'class-validator';

export class GetAlgorithmParams {
  @IsUUID(4)
  algorithmId: string;
}
