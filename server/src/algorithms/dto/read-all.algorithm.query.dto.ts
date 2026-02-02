import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { ReadAllQueryDTO } from 'src/common/dto';

export class ReadAllAlgorithmsQueryDTO extends ReadAllQueryDTO {
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    type: String,
    example: 'Ant Colony',
    description: 'Search term to filter algorithms by name',
  })
  search?: string;
}
