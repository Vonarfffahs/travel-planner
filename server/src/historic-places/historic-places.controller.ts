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

@Controller('historic-places')
export class HistoricPlacesController {
  constructor(private readonly historicPlacesService: HistoricPlacesService) {}

  @Get()
  getAll(
    @Query() query: ReadAllHistoricPlacesQueryDTO,
  ): Promise<ReadAllHistoricPlacesDTO> {
    return this.historicPlacesService.getAll(query);
  }

  @Get(':historicPlaceId')
  getOne(
    @Param() { historicPlaceId }: GetHistoricPlaceParams,
  ): Promise<ReadHistoricPlaceDTO> {
    return this.historicPlacesService.getOne(historicPlaceId);
  }

  @Post('create')
  async create(
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    const id = await this.historicPlacesService.create(data);
    return this.historicPlacesService.getOne(id);
  }

  @Put(':historicPlaceId')
  async update(
    @Param() { historicPlaceId }: GetHistoricPlaceParams,
    @Body() data: CreateHistoricPlaceDTO,
  ): Promise<ReadHistoricPlaceDTO> {
    await this.historicPlacesService.update(historicPlaceId, data);
    return this.historicPlacesService.getOne(historicPlaceId);
  }

  @Delete(':historicPlaceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { historicPlaceId }: GetHistoricPlaceParams): Promise<void> {
    return this.historicPlacesService.delete(historicPlaceId);
  }

  @Post('generate-matrix')
  generateMatrix() {
    return this.historicPlacesService.generateCostMatrix();
  }
}
