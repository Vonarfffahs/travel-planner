import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({
    example: 'JohnTraveler',
    description: 'Unique nickname for the user',
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address',
  })
  email: string;
}
