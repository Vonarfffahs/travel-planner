import { ApiProperty } from '@nestjs/swagger';

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
}
