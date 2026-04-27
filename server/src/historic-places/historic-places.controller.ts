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
import { HistoricPlacesService } from './historic-places.service';
import {
  CreateHistoricPlaceDTO,
  ReadAllHistoricPlacesDTO,
  ReadAllHistoricPlacesQueryDTO,
  ReadHistoricPlaceDTO,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AccessGuard, IdParamDTO, Roles } from 'src/common';
import { UserRole } from 'src/users/dto';

const ERROR_401_MESSAGE = 'Wrong or missing token';

@Controller('historic-places')
@UseGuards(AccessGuard)
@Roles(UserRole.Admin)
@ApiBearerAuth('access-token')
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
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  getAll(
    @Query() query: ReadAllHistoricPlacesQueryDTO,
  ): Promise<ReadAllHistoricPlacesDTO> {
    return this.historicPlacesService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific historic place by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the historic place',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 200,
    description: 'The historic place details',
    type: ReadHistoricPlaceDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  getOne(@Param() { id }: IdParamDTO): Promise<ReadHistoricPlaceDTO> {
    return this.historicPlacesService.getOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new historic place' })
  @ApiBody({ type: CreateHistoricPlaceDTO })
  @ApiResponse({
    status: 201,
    description: 'The historic place has been successfully created',
    type: ReadHistoricPlaceDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  async create(
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    const id = await this.historicPlacesService.create(data);
    return this.historicPlacesService.getOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing historic place' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the historic place to update',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiBody({ type: CreateHistoricPlaceDTO })
  @ApiResponse({
    status: 200,
    description: 'The historic place has been successfully updated',
    type: ReadHistoricPlaceDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  async update(
    @Param() { id }: IdParamDTO,
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    await this.historicPlacesService.update(id, data);
    return this.historicPlacesService.getOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a historic place' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the historic place to delete',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiResponse({
    status: 204,
    description: 'The historic place has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'Historic place not found' })
  delete(@Param() { id }: IdParamDTO): Promise<void> {
    return this.historicPlacesService.delete(id);
  }

  @Post('generate-matrix')
  @ApiOperation({
    summary: 'Generate distance matrix (Travel Costs) for all places',
  })
  @ApiResponse({
    status: 201,
    description: 'Matrix generation triggered successfully',
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  generateMatrix() {
    return this.historicPlacesService.generateCostMatrix();
  }
}
