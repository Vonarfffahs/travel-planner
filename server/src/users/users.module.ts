import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PasswordResetService } from './password-reset.service';
import { EmailModule } from 'src/email';

@Module({
  controllers: [ProfileController, UsersController],
  providers: [PasswordResetService, ProfileService, UsersService],
  exports: [ProfileService],
  imports: [EmailModule],
})
export class UsersModule {}
