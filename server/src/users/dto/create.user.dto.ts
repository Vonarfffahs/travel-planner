import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
