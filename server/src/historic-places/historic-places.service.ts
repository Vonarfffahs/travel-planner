import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateHistoricPlaceDTO,
  ReadAllHistoricPlacesDTO,
  ReadAllHistoricPlacesQueryDTO,
  ReadHistoricPlaceDTO,
} from './dto';
import { PrismaService } from 'src/prisma';
import { Prisma } from 'generated/prisma/client';
import { ReadHistoricPlaceMapper } from './mappers';

@Injectable()
export class HistoricPlacesService {
  private readonly mapper = new ReadHistoricPlaceMapper();

  constructor(private readonly prismaService: PrismaService) {}

  async getAll(
    query: ReadAllHistoricPlacesQueryDTO,
  ): Promise<ReadAllHistoricPlacesDTO> {
    const name: Prisma.StringFilter | undefined = query.search
      ? { contains: query.search, mode: 'insensitive' }
      : undefined;

    const count = await this.prismaService.historicPlace.count({
      where: { name },
    });

    const data = await this.prismaService.historicPlace.findMany({
      take: query.take,
      skip: query.skip,
      where: { name },
    });

    return this.mapper.mapMany(count, data);
  }

  async getOne(historicPlaceId: string): Promise<ReadHistoricPlaceDTO> {
    const historicPlace = await this.prismaService.historicPlace.findFirst({
      where: { id: historicPlaceId },
    });

    if (!historicPlace) {
      throw new NotFoundException('Historic place not found');
    }

    return this.mapper.mapOne(historicPlace);
  }

  async create(data: CreateHistoricPlaceDTO): Promise<string> {
    await this.checkName(data.name);
    await this.checkCoords(data.coordX, data.coordY);

    const { id } = await this.prismaService.historicPlace.create({
      data,
    });

    return id;
  }

  async update(
    historicPlaceId: string,
    data: CreateHistoricPlaceDTO,
  ): Promise<void> {
    await this.checkName(data.name, historicPlaceId);
    await this.checkCoords(data.coordX, data.coordY, historicPlaceId);

    await this.prismaService.historicPlace.update({
      where: { id: historicPlaceId },
      data,
    });
  }

  async delete(historicPlaceId: string): Promise<void> {
    await this.prismaService.historicPlace.delete({
      where: { id: historicPlaceId },
    });
  }

  // === НОВИЙ МЕТОД: Генерація матриці вартостей ===
  async generateCostMatrix(): Promise<string> {
    // 1. Отримуємо всі місця
    const places = await this.prismaService.historicPlace.findMany();

    if (places.length < 2) {
      throw new ConflictException(
        'Not enough places to generate matrix (need at least 2)',
      );
    }

    let count = 0;

    // 2. Подвійний цикл: кожне місце з кожним
    for (const source of places) {
      for (const destination of places) {
        // Пропускаємо петлі (сам в себе)
        if (source.id === destination.id) continue;

        // 3. Розрахунок відстані (це і буде наша travelCost)
        // Можна додати множник, наприклад * 10, якщо це ціна квитка
        const distance = Math.sqrt(
          Math.pow(destination.coordX - source.coordX, 2) +
            Math.pow(destination.coordY - source.coordY, 2),
        );

        // Округляємо до 2 знаків
        const cost = parseFloat(distance.toFixed(2));

        // 4. Зберігаємо або оновлюємо (upsert)
        await this.prismaService.travelCost.upsert({
          where: {
            sourceId_destinationId: {
              sourceId: source.id,
              destinationId: destination.id,
            },
          },
          update: { travelCost: cost },
          create: {
            sourceId: source.id,
            destinationId: destination.id,
            travelCost: cost,
          },
        });

        count++;
      }
    }

    return `Successfully generated ${count} travel costs connections.`;
  }

  private async checkName(
    name: string,
    historicPlaceId?: string,
  ): Promise<void> {
    const id = historicPlaceId ? { not: historicPlaceId } : undefined;

    const existingOne = await this.prismaService.historicPlace.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, id },
    });

    if (existingOne) {
      throw new ConflictException(`Historic place ${name} already exists.`);
    }
  }

  private async checkCoords(
    coordX: number,
    coordY: number,
    historicPlaceId?: string,
  ): Promise<void> {
    const id = historicPlaceId ? { not: historicPlaceId } : undefined;

    const existingOne = await this.prismaService.historicPlace.findFirst({
      where: { coordX: { equals: coordX }, coordY: { equals: coordY }, id },
    });

    if (existingOne) {
      throw new ConflictException(
        `Historic place with coords (${coordX}, ${coordY}) already exists.`,
      );
    }
  }
}
