import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReadUserMapper } from './mappers';
import { PrismaService } from 'src/prisma';
import {
  CreateUserDTO,
  ReadAllUsersDTO,
  ReadAllUsersQueryDTO,
  ReadUserDTO,
} from './dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  private readonly mapper = new ReadUserMapper();

  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query: ReadAllUsersQueryDTO): Promise<ReadAllUsersDTO> {
    const nickname: Prisma.StringFilter | undefined = query.search
      ? { contains: query.search, mode: 'insensitive' }
      : undefined;

    const count = await this.prismaService.user.count({
      where: { nickname },
    });

    const data = await this.prismaService.user.findMany({
      take: query.take,
      skip: query.skip,
      where: { nickname },
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
      data,
    });

    return id;
  }

  async update(userId: string, data: CreateUserDTO): Promise<void> {
    await this.checkNickname(data.nickname, userId);
    await this.checkEmail(data.email, userId);

    await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
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
