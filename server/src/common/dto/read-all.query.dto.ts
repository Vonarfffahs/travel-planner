import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MAX_PAGE_SIZE } from 'src/config';

export class ReadAllQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  @ApiPropertyOptional({
    example: 10,
    description: 'Number of records per page',
    default: MAX_PAGE_SIZE,
  })
  pageSize: number = MAX_PAGE_SIZE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (1-based index)',
    default: 1,
  })
  pageNumber: number = 1;

  get take(): number {
    return this.pageSize;
  }

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }
}
