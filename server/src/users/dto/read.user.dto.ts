import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user-role';
import { UserStatus } from './user-status';

export class ReadUserDTO {
  @ApiProperty({
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'TravelerJohn',
    description: 'Nickname of the user',
  })
  nickname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'admin or user',
    description: 'User`s role',
  })
  role: UserRole;

  @ApiProperty({
    example: 'active or banned',
    description: 'Defines user`s account status',
  })
  status: UserStatus;

  @ApiProperty({
    example: '2026-04-15T11:46:27.210Z',
    description: 'User account creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-04-15T11:46:27.210Z',
    description: 'User account update date',
  })
  updatedAt: Date;
}
