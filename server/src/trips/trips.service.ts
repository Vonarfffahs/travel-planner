import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDTO, ReadAllTripsDTO, ReadAllTripsQueryDTO } from './dto';
import { Prisma } from 'generated/prisma/client';
import { ReadTripMapper } from './mappers/read.trips.mapper';

@Injectable()
export class TripsService {
  private readonly mapper = new ReadTripMapper();

  constructor(private readonly prismaService: PrismaService) {}

  async getAll(query: ReadAllTripsQueryDTO): Promise<ReadAllTripsDTO> {
    const where: Prisma.TripWhereInput = {
      name: query.search
        ? { contains: query.search, mode: 'insensitive' }
        : undefined,
      userId: query.userId ? query.userId : undefined,
    };

    const count = await this.prismaService.trip.count({
      where,
    });

    const data = await this.prismaService.trip.findMany({
      take: query.take,
      skip: query.skip,
      where,
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
    const { parameters, path, ...tripData } = data;

    const trip = await this.prismaService.trip.create({
      data: {
        name: tripData.name,
        maxCostLimit: tripData.maxCostLimit,
        maxTimeLimit: tripData.maxTimeLimit,

        totalValue: tripData.totalValue,
        totalCost: tripData.totalCost,
        totalTime: tripData.totalTime,
        calculationTime: tripData.calculationTime,

        user: { connect: { id: tripData.userId } },
        algorithm: { connect: { id: tripData.algorithmId } },

        parameters: parameters ? { create: parameters } : undefined,
      },
    });

    if (path && path.length > 0) {
      await this.saveTripSteps(trip.id, path);
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

    const { parameters, path, ...tripData } = data;

    // Виконуємо транзакцію: видаляємо старі кроки і оновлюємо саму подорож
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

          totalValue: tripData.totalValue,
          totalCost: tripData.totalCost,
          totalTime: tripData.totalTime,
          calculationTime: tripData.calculationTime,

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

      if (path && path.length > 0) {
        const stepsData = path.map((placeId, index) => ({
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
