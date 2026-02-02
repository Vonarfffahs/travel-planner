import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class CreateHistoricPlaceDTO {
  @IsString()
  @Length(1, 100)
  @ApiProperty({
    example: 'Parthenon',
    description: 'The official name of the historic place',
  })
  name: string;

  @IsNumber()
  @ApiProperty({
    example: 37.9715,
    description: 'X Coordinate (Latitude)',
  })
  coordX: number; // x_j

  @IsNumber()
  @ApiProperty({
    example: 23.7267,
    description: 'Y Coordinate (Longitude)',
  })
  coordY: number; // y_j

  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty({
    example: 9.5,
    description: 'Historical value score (scale 0-10)',
    minimum: 0,
    maximum: 10,
  })
  historicValue: number; // w_j

  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 1,
    description: 'Time required to visit the place (in days)',
  })
  daysToVisit: number; // d_j
}
