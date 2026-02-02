import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { ReadAllQueryDTO } from 'src/common/dto';

export class ReadAllHistoricPlacesQueryDTO extends ReadAllQueryDTO {
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    type: String,
    example: 'Colosseum',
    description: 'Search term to filter historic places by name',
  })
  search?: string;
}
