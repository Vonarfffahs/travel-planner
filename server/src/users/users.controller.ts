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
import { UsersService } from './users.service';
import {
  BanUserDTO,
  CreateUserDTO,
  ReadAllUsersDTO,
  ReadAllUsersQueryDTO,
  ReadUserDTO,
  UserRole,
} from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AccessGuard,
  IdParamDTO,
  Roles,
  SWAGGER_BEARER_NAME,
} from 'src/common';

const ERROR_401_MESSAGE = 'Wrong or missing token';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessGuard)
  @ApiBearerAuth(SWAGGER_BEARER_NAME)
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: ReadAllUsersDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  getAll(@Query() query: ReadAllUsersQueryDTO): Promise<ReadAllUsersDTO> {
    return this.usersService.getAll(query);
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  @ApiBearerAuth(SWAGGER_BEARER_NAME)
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'User not found' })
  getOne(@Param() { id }: IdParamDTO): Promise<ReadUserDTO> {
    return this.usersService.getOne(id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() data: CreateUserDTO): Promise<ReadUserDTO> {
    const id = await this.usersService.create(data);
    return this.usersService.getOne(id);
  }

  @Put(':id')
  @UseGuards(AccessGuard)
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user to update',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param() { id }: IdParamDTO,
    @Body() data: CreateUserDTO,
  ): Promise<ReadUserDTO> {
    await this.usersService.update(id, data);
    return this.usersService.getOne(id);
  }

  @Post(':id/ban')
  @UseGuards(AccessGuard)
  @ApiBearerAuth(SWAGGER_BEARER_NAME)
  @Roles(UserRole.Admin)
  @ApiParam({
    name: 'id',
    description: 'UUID of the user to delete',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiBody({ type: BanUserDTO })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully banned',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  ban(
    @Param() { id }: IdParamDTO,
    @Body() data: BanUserDTO,
  ): Promise<ReadUserDTO> {
    return this.usersService.ban(id, data);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user to delete',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: ERROR_401_MESSAGE })
  @ApiResponse({ status: 404, description: 'User not found' })
  delete(@Param() { id }: IdParamDTO): Promise<void> {
    return this.usersService.delete(id);
  }
}
