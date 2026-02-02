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

@Controller('algorithms')
export class AlgorithmsController {
  constructor(private readonly algorithmsService: AlgorithmsService) {}

  @Get()
  getAll(
    @Query() query: ReadAllAlgorithmsQueryDTO,
  ): Promise<ReadAllAlgorithmsDTO> {
    return this.algorithmsService.getAll(query);
  }

  @Get(':algorithmId')
  getOne(
    @Param() { algorithmId }: GetAlgorithmParams,
  ): Promise<ReadAlgorithmDTO> {
    return this.algorithmsService.getOne(algorithmId);
  }

  @Post('create')
  async create(@Body() data: CreateAlgorithmDTO): Promise<ReadAlgorithmDTO> {
    const id = await this.algorithmsService.create(data);
    return this.algorithmsService.getOne(id);
  }

  @Put(':algorithmId')
  async update(
    @Param() { algorithmId }: GetAlgorithmParams,
    @Body() data: CreateAlgorithmDTO,
  ): Promise<ReadAlgorithmDTO> {
    await this.algorithmsService.update(algorithmId, data);
    return this.algorithmsService.getOne(algorithmId);
  }

  @Delete(':algorithmId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { algorithmId }: GetAlgorithmParams): Promise<void> {
    return this.algorithmsService.delete(algorithmId);
  }
}
