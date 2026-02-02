import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDTO } from './read.user.dto';

export class ReadAllUsersDTO {
  @ApiProperty({
    example: 50,
    description: 'Total number of users found',
  })
  count: number;

  @ApiProperty({
    type: [ReadUserDTO],
    description: 'List of users',
  })
  data: ReadUserDTO[];
}
