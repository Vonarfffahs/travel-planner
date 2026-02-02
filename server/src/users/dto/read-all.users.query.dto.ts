import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { ReadAllQueryDTO } from 'src/common/dto';

export class ReadAllUsersQueryDTO extends ReadAllQueryDTO {
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    type: String,
    example: 'JohnDoe',
    description: 'Search term to filter users by nickname or email',
  })
  search?: string;
}
