import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateHistoricPlaceDTO {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNumber()
  coordX: number; // x_j

  @IsNumber()
  coordY: number; // y_j

  @IsNumber()
  @Min(0)
  @Max(10)
  historicValue: number; // w_j

  @IsInt()
  @Min(0)
  daysToVisit: number; // d_j
}
