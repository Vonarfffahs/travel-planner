import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {
  CreateAlgorithmDTO,
  ReadAlgorithmDTO,
  ReadAllAlgorithmsDTO,
  ReadAllAlgorithmsQueryDTO,
} from './dto';
import { ReadAlgorithmMapper } from './mappers/read.algorithms.mapper';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AlgorithmsService {
  private readonly mapper = new ReadAlgorithmMapper();

  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    query: ReadAllAlgorithmsQueryDTO,
  ): Promise<ReadAllAlgorithmsDTO> {
    const name: Prisma.StringFilter | undefined = query.search
      ? { contains: query.search, mode: 'insensitive' }
      : undefined;

    const count = await this.prismaService.algorithm.count({
      where: { name },
    });

    const data = await this.prismaService.algorithm.findMany({
      take: query.take,
      skip: query.skip,
      where: { name },
    });

    return this.mapper.mapMany(count, data);
  }

  async getOne(algorithmId: string): Promise<ReadAlgorithmDTO> {
    const algorithm = await this.prismaService.algorithm.findFirst({
      where: { id: algorithmId },
    });

    if (!algorithm) {
      throw new NotFoundException('Algorithm not found');
    }

    return this.mapper.mapOne(algorithm);
  }

  async create(data: CreateAlgorithmDTO): Promise<string> {
    await this.checkName(data.name);

    const { id } = await this.prismaService.algorithm.create({
      data,
    });

    return id;
  }

  async update(algorithmId: string, data: CreateAlgorithmDTO): Promise<void> {
    await this.checkName(data.name, algorithmId);

    await this.prismaService.algorithm.update({
      where: { id: algorithmId },
      data,
    });
  }

  async delete(algorithmId: string): Promise<void> {
    await this.prismaService.algorithm.delete({
      where: { id: algorithmId },
    });
  }

  private async checkName(name: string, algorithmId?: string): Promise<void> {
    const id = algorithmId ? { not: algorithmId } : undefined;

    const existingOne = await this.prismaService.algorithm.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, id },
    });

    if (existingOne) {
      throw new ConflictException(`Algorithm ${name} already exists.`);
    }
  }
}
