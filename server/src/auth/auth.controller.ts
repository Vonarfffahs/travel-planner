import { Body, Controller, Post } from '@nestjs/common';
import { AccessDTO, LoginDTO } from './dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 201,
    description: 'Successful log in',
  })
  @ApiResponse({ status: 401, description: 'Wrong user email or password' })
  login(@Body() data: LoginDTO): Promise<AccessDTO> {
    return this.authService.login(data);
  }
}
