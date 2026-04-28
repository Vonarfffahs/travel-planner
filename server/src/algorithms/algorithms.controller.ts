import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlgorithmsService } from './algorithms.service';
import {
  CreateAlgorithmDTO,
  ReadAlgorithmDTO,
  ReadAllAlgorithmsDTO,
  ReadAllAlgorithmsQueryDTO,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CalculateTripDto } from './dto/calculate.trip.dto';
import {
  AccessGuard,
  IdParamDTO,
  Roles,
  SWAGGER_BEARER_NAME,
} from 'src/common';
import { UserRole } from 'src/users/dto';

const ERROR_401_MESSAGE = 'Wrong or missing token';

@Controller('algorithms')
@UseGuards(AccessGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Roles(UserRole.Admin)
export class AlgorithmsController {
  constructor(private readonly algorithmsService: AlgorithmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all algorithms with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of algorithms retrieved successfully',
    type: ReadAllAlgorithmsDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  getAll(
    @Query() query: ReadAllAlgorithmsQueryDTO,
  ): Promise<ReadAllAlgorithmsDTO> {
    return this.algorithmsService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific algorithm by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the algorithm',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 200,
    description: 'The algorithm details',
    type: ReadAlgorithmDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  getOne(@Param() { id }: IdParamDTO): Promise<ReadAlgorithmDTO> {
    return this.algorithmsService.getOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new algorithm' })
  @ApiBody({ type: CreateAlgorithmDTO })
  @ApiResponse({
    status: 201,
    description: 'The algorithm has been successfully created',
    type: ReadAlgorithmDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  async create(@Body() data: CreateAlgorithmDTO): Promise<ReadAlgorithmDTO> {
    const id = await this.algorithmsService.create(data);
    return this.algorithmsService.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing algorithm' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the algorithm to update',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiBody({ type: CreateAlgorithmDTO })
  @ApiResponse({
    status: 200,
    description: 'The algorithm has been successfully updated',
    type: ReadAlgorithmDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  async update(
    @Param() { id }: IdParamDTO,
    @Body() data: CreateAlgorithmDTO,
  ): Promise<ReadAlgorithmDTO> {
    await this.algorithmsService.update(id, data);
    return this.algorithmsService.getOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an algorithm' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the algorithm to delete',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 204,
    description: 'The algorithm has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  delete(@Param() { id }: IdParamDTO): Promise<void> {
    return this.algorithmsService.delete(id);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate optimal route' })
  @ApiResponse({ status: 200, description: 'Route calculated successfully' })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  async calculateTrip(@Body() data: CalculateTripDto) {
    return this.algorithmsService.calculate(data);
  }
}
