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
import { UsersService } from './users.service';
import {
  CreateUserDTO,
  GetUserParams,
  ReadAllUsersDTO,
  ReadAllUsersQueryDTO,
  ReadUserDTO,
} from './dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(@Query() query: ReadAllUsersQueryDTO): Promise<ReadAllUsersDTO> {
    return this.usersService.getAll(query);
  }

  @Get(':userId')
  getOne(@Param() { userId }: GetUserParams): Promise<ReadUserDTO> {
    return this.usersService.getOne(userId);
  }

  @Post('create')
  async create(@Body() data: CreateUserDTO): Promise<ReadUserDTO> {
    const id = await this.usersService.create(data);
    return this.usersService.getOne(id);
  }

  @Put(':userId')
  async update(
    @Param() { userId }: GetUserParams,
    @Body() data: CreateUserDTO,
  ): Promise<ReadUserDTO> {
    await this.usersService.update(userId, data);
    return this.usersService.getOne(userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { userId }: GetUserParams): Promise<void> {
    return this.usersService.delete(userId);
  }
}
