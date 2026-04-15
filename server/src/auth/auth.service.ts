import { Injectable } from '@nestjs/common';
import { AccessDTO, LoginDTO } from './dto';
import { ProfileService } from 'src/users/profile.service';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/users/dto';

@Injectable()
export class AuthService {
  constructor(private readonly profileService: ProfileService) {}

  login(data: LoginDTO): AccessDTO {
    console.log(data);
    return {
      id: randomUUID(),
      nickname: 'nickname',
      email: 'email',
      role: UserRole.User,
      token: 'hello',
    };
  }
}
