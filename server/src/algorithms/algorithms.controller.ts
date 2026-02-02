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
} from '@nestjs/common';
import { AlgorithmsService } from './algorithms.service';
import {
  CreateAlgorithmDTO,
  ReadAlgorithmDTO,
  ReadAllAlgorithmsDTO,
  ReadAllAlgorithmsQueryDTO,
} from './dto';
import { GetAlgorithmParams } from './dto/get.algorithm.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('algorithms')
export class AlgorithmsController {
  constructor(private readonly algorithmsService: AlgorithmsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all algorithms with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of algorithms retrieved successfully',
    type: ReadAllAlgorithmsDTO,
  })
  getAll(
    @Query() query: ReadAllAlgorithmsQueryDTO,
  ): Promise<ReadAllAlgorithmsDTO> {
    return this.algorithmsService.getAll(query);
  }

  @Get(':algorithmId')
  @ApiOperation({ summary: 'Get a specific algorithm by ID' })
  @ApiParam({
    name: 'algorithmId',
    description: 'UUID of the algorithm',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 200,
    description: 'The algorithm details',
    type: ReadAlgorithmDTO,
  })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  getOne(
    @Param() { algorithmId }: GetAlgorithmParams,
  ): Promise<ReadAlgorithmDTO> {
    return this.algorithmsService.getOne(algorithmId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new algorithm' })
  @ApiBody({ type: CreateAlgorithmDTO })
  @ApiResponse({
    status: 201,
    description: 'The algorithm has been successfully created',
    type: ReadAlgorithmDTO,
  })
  async create(@Body() data: CreateAlgorithmDTO): Promise<ReadAlgorithmDTO> {
    const id = await this.algorithmsService.create(data);
    return this.algorithmsService.getOne(id);
  }

  @Put(':algorithmId')
  @ApiOperation({ summary: 'Update an existing algorithm' })
  @ApiParam({
    name: 'algorithmId',
    description: 'UUID of the algorithm to update',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiBody({ type: CreateAlgorithmDTO })
  @ApiResponse({
    status: 200,
    description: 'The algorithm has been successfully updated',
    type: ReadAlgorithmDTO,
  })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  async update(
    @Param() { algorithmId }: GetAlgorithmParams,
    @Body() data: CreateAlgorithmDTO,
  ): Promise<ReadAlgorithmDTO> {
    await this.algorithmsService.update(algorithmId, data);
    return this.algorithmsService.getOne(algorithmId);
  }

  @Delete(':algorithmId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an algorithm' })
  @ApiParam({
    name: 'algorithmId',
    description: 'UUID of the algorithm to delete',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 204,
    description: 'The algorithm has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Algorithm not found' })
  delete(@Param() { algorithmId }: GetAlgorithmParams): Promise<void> {
    return this.algorithmsService.delete(algorithmId);
  }
}
