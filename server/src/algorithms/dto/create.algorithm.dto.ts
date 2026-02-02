import { IsString, Length } from 'class-validator';

export class CreateAlgorithmDTO {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 1000)
  description: string;
}
