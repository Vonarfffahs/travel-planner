import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAlgorithmParametersDTO {
  @IsOptional()
  @IsNumber()
  alpha?: number;

  @IsOptional()
  @IsNumber()
  beta?: number;

  @IsOptional()
  @IsNumber()
  evaporationRate?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  iterations?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  antCount?: number;
}
