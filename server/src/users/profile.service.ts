import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReadProfileDTO, SetPasswordDTO, UserRole } from './dto';
import { PasswordResetService } from './password-reset.service';
import { PrismaService } from 'src/prisma';
import { UserStatus } from 'generated/prisma/enums';
import { HelloEmailService } from 'src/email';

@Injectable()
export class ProfileService {
  constructor(
    private readonly helloEmailService: HelloEmailService,
    private readonly passwordResetService: PasswordResetService,
    private readonly prismaService: PrismaService,
  ) {}

  public getSelf(id: string): ReadProfileDTO {
    return {
      id,
      nickname: 'nickname',
      email: 'example@mail.com',
      role: UserRole.User,
    };
  }

  public async resetPassword(email: string): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user) return;
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('Account is banned');
    }

    const reset = await this.passwordResetService.createOrReplace(user.id);
    await this.helloEmailService.send({
      ...reset,
      email: user.email,
      nickname: user.nickname,
    });
  }

  public async setPassword({
    email,
    code,
    password,
  }: SetPasswordDTO): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!user) return;
    if (user.status !== UserStatus.active) {
      throw new ForbiddenException('Account is banned');
    }

    await this.passwordResetService.setPassword(user.id, code, password);
  }
}
