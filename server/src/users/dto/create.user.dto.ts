import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from './user-role';

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

  @IsEnum(UserRole)
  @ApiProperty({
    example: 'admin or user',
    description: 'User`s role',
  })
  role: UserRole;
}
