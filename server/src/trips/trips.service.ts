import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Перевір шлях імпорту
import { CreateTripDTO, ReadAllTripsDTO, ReadAllTripsQueryDTO } from './dto';
import { Prisma } from 'generated/prisma/client';
import { ReadTripMapper } from './mappers/read.trips.mapper';
import { SolverResult, TravelSolver } from 'src/algorithms/interfaces';
import { AntColonySolver, GreedySolver } from 'src/algorithms/solvers';

@Injectable()
export class TripsService {
  private readonly mapper = new ReadTripMapper();

  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query: ReadAllTripsQueryDTO): Promise<ReadAllTripsDTO> {
    const name: Prisma.StringFilter | undefined = query.search
      ? { contains: query.search, mode: 'insensitive' }
      : undefined;

    const count = await this.prismaService.trip.count({
      where: { name },
    });

    const data = await this.prismaService.trip.findMany({
      take: query.take,
      skip: query.skip,
      where: { name },
      orderBy: { name: 'asc' },
      include: {
        algorithm: true,
        parameters: true,
        tripSteps: {
          include: { historicPlace: true },
          orderBy: { visitOrder: 'asc' },
        },
      },
    });

    return this.mapper.mapMany(count, data);
  }

  async getOne(tripId: string) {
    const trip = await this.prismaService.trip.findUnique({
      where: { id: tripId },
      include: {
        algorithm: true,
        parameters: true,
        tripSteps: {
          include: { historicPlace: true },
          orderBy: { visitOrder: 'asc' },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    return trip;
  }

  async create(data: CreateTripDTO): Promise<string> {
    const { parameters, ...tripData } = data;

    const [allPlaces, allCosts, selectedAlgorithm] = await Promise.all([
      this.prismaService.historicPlace.findMany(),
      this.prismaService.travelCost.findMany(),
      this.prismaService.algorithm.findUnique({
        where: { id: tripData.algorithmId },
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
      tripData.maxCostLimit,
      tripData.maxTimeLimit,
    );

    const trip = await this.prismaService.trip.create({
      data: {
        name: tripData.name,
        maxCostLimit: tripData.maxCostLimit,
        maxTimeLimit: tripData.maxTimeLimit,

        totalValue: algorithmResult.totalValue,
        totalCost: algorithmResult.totalCost,
        totalTime: algorithmResult.totalTime,
        calculationTime: algorithmResult.calculationTime,

        user: { connect: { id: tripData.userId } },
        algorithm: { connect: { id: tripData.algorithmId } },

        parameters: parameters ? { create: parameters } : undefined,
      },
    });

    if (algorithmResult.path.length > 0) {
      await this.saveTripSteps(trip.id, algorithmResult.path);
    }

    return trip.id;
  }

  async update(tripId: string, data: CreateTripDTO): Promise<void> {
    const existingTrip = await this.prismaService.trip.findUnique({
      where: { id: tripId },
    });

    if (!existingTrip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    const { parameters, ...tripData } = data;

    const [allPlaces, allCosts, selectedAlgorithm] = await Promise.all([
      this.prismaService.historicPlace.findMany(),
      this.prismaService.travelCost.findMany(),
      this.prismaService.algorithm.findUnique({
        where: { id: tripData.algorithmId },
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
      tripData.maxCostLimit,
      tripData.maxTimeLimit,
    );

    // 4. Виконуємо транзакцію: видаляємо старі кроки і оновлюємо саму подорож
    // Ми використовуємо $transaction, щоб гарантувати цілісність даних
    await this.prismaService.$transaction(async (prisma) => {
      await prisma.tripStep.deleteMany({
        where: { tripId },
      });

      await prisma.trip.update({
        where: { id: tripId },
        data: {
          name: tripData.name,
          maxCostLimit: tripData.maxCostLimit,
          maxTimeLimit: tripData.maxTimeLimit,

          totalValue: algorithmResult.totalValue,
          totalCost: algorithmResult.totalCost,
          totalTime: algorithmResult.totalTime,
          calculationTime: algorithmResult.calculationTime,

          user: { connect: { id: tripData.userId } },
          algorithm: { connect: { id: tripData.algorithmId } },

          parameters: parameters
            ? {
                upsert: {
                  create: parameters,
                  update: parameters,
                },
              }
            : undefined,
        },
      });

      if (algorithmResult.path.length > 0) {
        const stepsData = algorithmResult.path.map((placeId, index) => ({
          tripId: tripId,
          historicPlaceId: placeId,
          visitOrder: index + 1,
        }));

        await prisma.tripStep.createMany({
          data: stepsData,
        });
      }
    });
  }

  async remove(tripId: string): Promise<void> {
    await this.getOne(tripId);

    await this.prismaService.trip.delete({
      where: { id: tripId },
    });
  }

  private async saveTripSteps(
    tripId: string,
    orderedPlacesIds: string[],
  ): Promise<void> {
    const stepsData = orderedPlacesIds.map((placeId, index) => ({
      tripId: tripId,
      historicPlaceId: placeId,
      visitOrder: index + 1,
    }));

    await this.prismaService.tripStep.createMany({
      data: stepsData,
    });
  }
}
