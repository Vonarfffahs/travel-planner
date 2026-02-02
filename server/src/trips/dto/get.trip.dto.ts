import { IsUUID } from 'class-validator';

export class GetTripParams {
  @IsUUID(4)
  tripId: string;
}
