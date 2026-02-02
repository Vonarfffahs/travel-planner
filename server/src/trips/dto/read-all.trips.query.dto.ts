import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { ReadAllQueryDTO } from 'src/common/dto';

export class ReadAllTripsQueryDTO extends ReadAllQueryDTO {
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    type: String,
    example: 'Summer Vacation',
    description: 'Search term to filter trips by name',
  })
  search?: string;
}
