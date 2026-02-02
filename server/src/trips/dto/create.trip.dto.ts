import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAlgorithmParametersDTO } from './create.algorithm-parameters.dto';

export class CreateTripDTO {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsNumber()
  @Min(0)
  maxCostLimit: number; // C

  @IsNumber()
  @Min(0)
  maxTimeLimit: number; // D

  @IsUUID(4)
  algorithmId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAlgorithmParametersDTO)
  parameters?: CreateAlgorithmParametersDTO;

  @IsUUID(4)
  userId: string;
}
