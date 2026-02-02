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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips with pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of trips retrieved successfully',
    type: ReadAllTripsDTO,
  })
  getAll(@Query() query: ReadAllTripsQueryDTO): Promise<ReadAllTripsDTO> {
    return this.tripsService.getAll(query);
  }

  @Get(':tripId')
  @ApiOperation({ summary: 'Get trip details by ID' })
  @ApiParam({
    name: 'tripId',
    description: 'UUID of the trip',
    example: '5417acea-28ff-4ae1-8b55-768c12bf784e',
  })
  @ApiResponse({
    status: 200,
    description: 'Trip details retrieved',
    type: ReadTripDTO,
  })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  getOne(@Param() { tripId }: GetTripParams): Promise<ReadTripDTO> {
    return this.tripsService.getOne(tripId);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new trip and calculate the route',
    description:
      'Creates a trip, runs the selected algorithm (Greedy or ACO), and saves the result.',
  })
  @ApiBody({ type: CreateTripDTO })
  @ApiResponse({
    status: 201,
    description: 'Trip created and calculated successfully',
    type: ReadTripDTO,
  })
  @ApiResponse({ status: 404, description: 'User or Algorithm not found' })
  async create(@Body() data: CreateTripDTO): Promise<ReadTripDTO> {
    const id = await this.tripsService.create(data);
    return this.tripsService.getOne(id);
  }

  @Put(':tripId')
  @ApiOperation({ summary: 'Update an existing trip' })
  @ApiParam({
    name: 'tripId',
    description: 'UUID of the trip to update',
  })
  @ApiBody({ type: CreateTripDTO })
  @ApiResponse({
    status: 200,
    description: 'Trip updated successfully',
    type: ReadTripDTO,
  })
  async update(
    @Param() { tripId }: GetTripParams,
    @Body() data: CreateTripDTO,
  ): Promise<ReadTripDTO> {
    await this.tripsService.update(tripId, data);
    return this.tripsService.getOne(tripId);
  }

  @Delete(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a trip' })
  @ApiParam({
    name: 'tripId',
    description: 'UUID of the trip to delete',
  })
  @ApiResponse({ status: 204, description: 'Trip deleted successfully' })
  delete(@Param() { tripId }: GetTripParams): Promise<void> {
    return this.tripsService.remove(tripId);
  }
}
