import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BanUserDTO {
  @IsBoolean()
  @ApiProperty({
    example: 'false',
    description: 'Defines user`s account status',
  })
  banned: boolean;
}
