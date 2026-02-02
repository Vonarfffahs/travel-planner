import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import {
  CreateTripDTO,
  GetTripParams,
  ReadAllTripsDTO,
  ReadAllTripsQueryDTO,
  ReadTripDTO,
} from './dto';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  getAll(@Query() query: ReadAllTripsQueryDTO): Promise<ReadAllTripsDTO> {
    return this.tripsService.getAll(query);
  }

  @Get(':tripId')
  getOne(@Param() { tripId }: GetTripParams): Promise<ReadTripDTO> {
    return this.tripsService.getOne(tripId);
  }

  @Post('create')
  async create(@Body() data: CreateTripDTO): Promise<ReadTripDTO> {
    const id = await this.tripsService.create(data);
    return this.tripsService.getOne(id);
  }

  @Put(':tripId')
  async update(
    @Param() { tripId }: GetTripParams,
    @Body() data: CreateTripDTO,
  ): Promise<ReadTripDTO> {
    await this.tripsService.update(tripId, data);
    return this.tripsService.getOne(tripId);
  }

  @Delete(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { tripId }: GetTripParams): Promise<void> {
    return this.tripsService.remove(tripId);
  }
}
