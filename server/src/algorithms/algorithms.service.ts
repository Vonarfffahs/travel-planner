import {
  BadRequestException,
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
import { CalculateTripDto } from './dto/calculate.trip.dto';
import { SolverResult, TravelSolver } from './interfaces';
import { AntColonySolver, GreedySolver } from './solvers';

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
      orderBy: { name: 'asc' },
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

  async calculate(data: CalculateTripDto) {
    // TODO: what this method returns?
    const { algorithmId, maxCostLimit, maxTimeLimit, parameters } = data;

    const [allPlaces, allCosts, selectedAlgorithm] = await Promise.all([
      this.prismaService.historicPlace.findMany(),
      this.prismaService.travelCost.findMany(),
      this.prismaService.algorithm.findUnique({
        where: { id: algorithmId },
      }),
    ]);

    if (!selectedAlgorithm) {
      throw new NotFoundException('Algorithm not found.');
    }

    let solver: TravelSolver;

    if (selectedAlgorithm.name === 'Greedy') {
      solver = new GreedySolver(allPlaces, allCosts);
    } else if (selectedAlgorithm.name === 'Ant Colony Optimization') {
      solver = new AntColonySolver(allPlaces, allCosts, parameters);
    } else {
      throw new BadRequestException(
        `Unknown algorithm: ${selectedAlgorithm.name}`,
      );
    }

    const algorithmResult: SolverResult = solver.solve(
      maxCostLimit,
      maxTimeLimit,
    );

    const populatedpath = algorithmResult.path.map((historicPlaceId, index) => {
      const historicPlaceDetails = allPlaces.find(
        (p) => p.id === historicPlaceId,
      );
      return {
        visitOrder: index + 1,
        ...historicPlaceDetails,
      };
    });

    return {
      algorithmId: selectedAlgorithm.id,
      algorithmName: selectedAlgorithm.name,
      totalValue: algorithmResult.totalValue,
      totalCost: algorithmResult.totalCost,
      totalTime: algorithmResult.totalTime,
      calculationTime: algorithmResult.calculationTime,
      path: populatedpath,
      parameters: parameters || null,
    };
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
