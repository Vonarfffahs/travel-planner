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
import { HistoricPlacesService } from './historic-places.service';
import {
  CreateHistoricPlaceDTO,
  GetHistoricPlaceParams,
  ReadAllHistoricPlacesDTO,
  ReadAllHistoricPlacesQueryDTO,
  ReadHistoricPlaceDTO,
} from './dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('historic-places')
export class HistoricPlacesController {
  constructor(private readonly historicPlacesService: HistoricPlacesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all historic places with pagination and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'List of historic places retrieved successfully',
    type: ReadAllHistoricPlacesDTO,
  })
  getAll(
    @Query() query: ReadAllHistoricPlacesQueryDTO,
  ): Promise<ReadAllHistoricPlacesDTO> {
    return this.historicPlacesService.getAll(query);
  }

  @Get(':historicPlaceId')
  @ApiOperation({ summary: 'Get a specific historic place by ID' })
  @ApiParam({
    name: 'historicPlaceId',
    description: 'UUID of the historic place',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 200,
    description: 'The historic place details',
    type: ReadHistoricPlaceDTO,
  })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  getOne(
    @Param() { historicPlaceId }: GetHistoricPlaceParams,
  ): Promise<ReadHistoricPlaceDTO> {
    return this.historicPlacesService.getOne(historicPlaceId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new historic place' })
  @ApiBody({ type: CreateHistoricPlaceDTO })
  @ApiResponse({
    status: 201,
    description: 'The historic place has been successfully created',
    type: ReadHistoricPlaceDTO,
  })
  async create(
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    const id = await this.historicPlacesService.create(data);
    return this.historicPlacesService.getOne(id);
  }

  @Put(':historicPlaceId')
  @ApiOperation({ summary: 'Update an existing historic place' })
  @ApiParam({
    name: 'historicPlaceId',
    description: 'UUID of the historic place to update',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiBody({ type: CreateHistoricPlaceDTO })
  @ApiResponse({
    status: 200,
    description: 'The historic place has been successfully updated',
    type: ReadHistoricPlaceDTO,
  })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  async update(
    @Param() { historicPlaceId }: GetHistoricPlaceParams,
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    await this.historicPlacesService.update(historicPlaceId, data);
    return this.historicPlacesService.getOne(historicPlaceId);
  }

  @Delete(':historicPlaceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a historic place' })
  @ApiParam({
    name: 'historicPlaceId',
    description: 'UUID of the historic place to delete',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 204,
    description: 'The historic place has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  delete(@Param() { historicPlaceId }: GetHistoricPlaceParams): Promise<void> {
    return this.historicPlacesService.delete(historicPlaceId);
  }

  @Post('generate-matrix')
  @ApiOperation({
    summary: 'Generate distance matrix (Travel Costs) for all places',
  })
  @ApiResponse({
    status: 201,
    description: 'Matrix generation triggered successfully',
  })
  generateMatrix() {
    return this.historicPlacesService.generateCostMatrix();
  }
}
