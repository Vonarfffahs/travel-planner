import { IsInt, IsOptional, Length, Max, Min } from 'class-validator';
import { MAX_PAGE_SIZE } from 'src/config';

export class ReadAllHistoricPlacesQueryDTO {
  @IsOptional()
  @Length(1, 50)
  search: string | undefined | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  pageSize: number = MAX_PAGE_SIZE;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber: number = 1;
}
