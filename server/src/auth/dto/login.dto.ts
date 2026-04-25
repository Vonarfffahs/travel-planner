import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @ApiProperty({
    example: 'example@example.com',
    description: 'User email',
  })
  email: string;

  @IsStrongPassword()
  @ApiProperty({
    example: 'Password1!',
    description: 'User password',
  })
  password: string;
}
