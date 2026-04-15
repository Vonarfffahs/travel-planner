import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PasswordResetService } from './password-reset.service';

@Module({
  controllers: [ProfileController, UsersController],
  providers: [PasswordResetService, ProfileService, UsersService],
  exports: [ProfileService],
})
export class UsersModule {}
