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
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: ReadAllUsersDTO,
  })
  getAll(@Query() query: ReadAllUsersQueryDTO): Promise<ReadAllUsersDTO> {
    return this.usersService.getAll(query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a specific user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  getOne(@Param() { userId }: GetUserParams): Promise<ReadUserDTO> {
    return this.usersService.getOne(userId);
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

  @Put(':userId')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user to update',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: ReadUserDTO,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param() { userId }: GetUserParams,
    @Body() data: CreateUserDTO,
  ): Promise<ReadUserDTO> {
    await this.usersService.update(userId, data);
    return this.usersService.getOne(userId);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'userId',
    description: 'UUID of the user to delete',
    example: 'cc98cacc-e166-4cfd-8bd9-f51797808c79',
  })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  delete(@Param() { userId }: GetUserParams): Promise<void> {
    return this.usersService.delete(userId);
  }
}
