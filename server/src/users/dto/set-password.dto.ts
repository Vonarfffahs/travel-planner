import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class SetPasswordDTO {
  @IsNotEmpty()
  @ApiProperty({
    example: '0327412',
    description: 'Validation code received from email',
  })
  @Length(1, 100)
  code: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Valid email address',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'asdsa',
    description: 'Valid password',
  })
  @IsStrongPassword()
  password: string;
}
