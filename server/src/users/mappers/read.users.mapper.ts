import { User } from 'generated/prisma/client';
import { ReadAllUsersDTO, ReadUserDTO } from '../dto';
import { mapUserRoleFromDB } from './user-role.mapper';
import { mapUserStatusFromDB } from './user-status.mapper';

export class ReadUserMapper {
  public mapOne(user: User): ReadUserDTO {
    return {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      role: mapUserRoleFromDB(user.role),
      status: mapUserStatusFromDB(user.status),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public mapMany(count: number, data: User[]): ReadAllUsersDTO {
    return {
      count,
      data: data.map((one) => this.mapOne(one)),
    };
  }
}
