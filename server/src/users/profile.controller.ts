import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ReadProfileDTO, ResetPasswordDTO, SetPasswordDTO } from './dto';
import { randomUUID } from 'crypto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user`s data for non-admin role' })
  @ApiResponse({
    status: 200,
    description: 'User`s data received successfully',
  })
  @ApiResponse({ status: 404, description: 'User is not found ' })
  getProfile(): ReadProfileDTO {
    return this.profileService.getSelf(randomUUID());
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset user`s password' })
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({
    status: 204,
    description: 'Password reset code successfully sent to user`s email',
  })
  @ApiResponse({ status: 403, description: 'Users`s account is banned' })
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() { email }: ResetPasswordDTO): Promise<void> {
    return this.profileService.resetPassword(email);
  }

  @Post('password')
  @ApiOperation({ summary: 'Set user`s password' })
  @ApiBody({ type: SetPasswordDTO })
  @ApiResponse({
    status: 204,
    description: 'Password set code successfully sent to user`s email',
  })
  @ApiResponse({ status: 401, description: 'Wrong set code' })
  @ApiResponse({ status: 403, description: 'Users`s account is banned' })
  @HttpCode(HttpStatus.NO_CONTENT)
  setPassword(@Body() data: SetPasswordDTO): Promise<void> {
    return this.profileService.setPassword(data);
  }
}
