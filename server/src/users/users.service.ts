import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { mapUserRoleToDB, ReadUserMapper } from './mappers';
import { PrismaService } from 'src/prisma';
import {
  BanUserDTO,
  CreateUserDTO,
  ReadAllUsersDTO,
  ReadAllUsersQueryDTO,
  ReadUserDTO,
} from './dto';
import { Prisma, UserStatus } from 'generated/prisma/client';
import { randomUUID } from 'crypto';
import { PasswordResetService } from './password-reset.service';
import { HelloEmailService } from 'src/email';

@Injectable()
export class UsersService {
  private readonly mapper = new ReadUserMapper();

  constructor(
    private readonly helloEmailService: HelloEmailService,
    private readonly passwordResetService: PasswordResetService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAll(query: ReadAllUsersQueryDTO): Promise<ReadAllUsersDTO> {
    const where: Prisma.UserWhereInput = query.search
      ? {
          OR: [
            { nickname: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const count = await this.prismaService.user.count({
      where,
    });

    const data = await this.prismaService.user.findMany({
      take: query.take,
      skip: query.skip,
      where,
      orderBy: { nickname: 'asc' },
    });

    return this.mapper.mapMany(count, data);
  }

  async getOne(userId: string): Promise<ReadUserDTO> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapper.mapOne(user);
  }

  async create(data: CreateUserDTO): Promise<string> {
    await this.checkNickname(data.nickname);
    await this.checkEmail(data.email);

    const { id } = await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        nickname: data.nickname,
        email: data.email,
        role: mapUserRoleToDB(data.role),
        status: UserStatus.active,
      },
    });

    const reset = await this.passwordResetService.createOrReplace(id);
    await this.helloEmailService.send({
      ...reset,
      email: data.email,
      nickname: data.nickname,
    });

    return id;
  }

  async update(userId: string, data: CreateUserDTO): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.checkNickname(data.nickname, userId);
    await this.checkEmail(data.email, userId);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: data.email,
        nickname: data.nickname,
        role: mapUserRoleToDB(data.role),
      },
    });
  }

  async ban(userId: string, data: BanUserDTO): Promise<ReadUserDTO> {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        status: data.banned ? UserStatus.banned : UserStatus.active,
      },
    });

    return this.mapper.mapOne(updatedUser);
  }

  async delete(userId: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id: userId },
    });
  }

  private async checkNickname(
    nickname: string,
    userId?: string,
  ): Promise<void> {
    const id = userId ? { not: userId } : undefined;

    const existingOne = await this.prismaService.user.findFirst({
      where: { nickname: { equals: nickname, mode: 'insensitive' }, id },
    });

    if (existingOne) {
      throw new ConflictException(`User ${nickname} already exists.`);
    }
  }

  private async checkEmail(email: string, userId?: string): Promise<void> {
    const id = userId ? { not: userId } : undefined;

    const existingOne = await this.prismaService.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' }, id },
    });

    if (existingOne) {
      throw new ConflictException(
        `User with such email: ${email} already exists.`,
      );
    }
  }
}
