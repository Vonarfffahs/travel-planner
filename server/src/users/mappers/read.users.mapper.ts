import { User } from 'generated/prisma/client';
import { ReadAllUsersDTO, ReadUserDTO } from '../dto';

export class ReadUserMapper {
  public mapOne(user: User): ReadUserDTO {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };
  }

  public mapMany(count: number, data: User[]): ReadAllUsersDTO {
    return {
      count,
      data: data.map((one) => this.mapOne(one)),
    };
  }
}
