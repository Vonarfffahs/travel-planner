import { IsOptional, Length } from 'class-validator';
import { ReadAllQueryDTO } from 'src/common/dto';

export class ReadAllAlgorithmsQueryDTO extends ReadAllQueryDTO {
  @IsOptional()
  @Length(1, 50)
  search: string | undefined | null;
}
