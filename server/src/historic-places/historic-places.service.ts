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
      orderBy: { name: 'asc' },
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

  // === ОНОВЛЕНИЙ МЕТОД: Генерація матриці реальних відстаней через OSRM ===
  async generateCostMatrix(): Promise<string> {
    // 1. Отримуємо всі місця з БД
    const places = await this.prismaService.historicPlace.findMany();

    if (places.length < 2) {
      throw new ConflictException(
        'Not enough places to generate matrix (need at least 2)',
      );
    }

    // OSRM Public API має ліміт близько 100 координат в одному запиті.
    // Для дипломного проєкту цього зазвичай достатньо.
    if (places.length > 100) {
      throw new ConflictException(
        'Too many places for free OSRM API. Max 100.',
      );
    }

    // 2. Формуємо рядок координат для OSRM
    // Формат OSRM: longitude,latitude (довгота, широта).
    // Припускаємо, що coordX - це довгота, coordY - широта.
    const coordinatesString = places
      .map((place) => `${place.coordX},${place.coordY}`)
      .join(';');

    // 3. Робимо запит до OSRM Table API
    // driving - на авто. distances - просимо повернути матрицю відстаней в метрах
    const osrmUrl = `http://router.project-osrm.org/table/v1/driving/${coordinatesString}?annotations=distance`;

    try {
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.distances) {
        throw new Error(`OSRM API error: ${data.code}`);
      }

      // data.distances - це двовимірний масив (матриця)
      const distancesMatrix = data.distances;
      let count = 0;

      // 4. Проходимося по матриці і зберігаємо в БД
      for (let i = 0; i < places.length; i++) {
        for (let j = 0; j < places.length; j++) {
          if (i === j) continue; // Пропускаємо шлях сам до себе

          const source = places[i];
          const destination = places[j];

          // Отримуємо відстань в метрах і переводимо в кілометри
          const distanceMeters = distancesMatrix[i][j];
          const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));

          // 5. Зберігаємо в БД
          await this.prismaService.travelCost.upsert({
            where: {
              sourceId_destinationId: {
                sourceId: source.id,
                destinationId: destination.id,
              },
            },
            update: { travelCost: distanceKm },
            create: {
              sourceId: source.id,
              destinationId: destination.id,
              travelCost: distanceKm,
            },
          });

          count++;
        }
      }

      return `Successfully generated ${count} real-world travel costs using OSRM.`;
    } catch (error) {
      console.error('Error fetching distances from OSRM:', error);
      throw new ConflictException('Failed to generate real-world cost matrix.');
    }
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
