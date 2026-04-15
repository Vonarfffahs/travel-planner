import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Prisma } from 'generated/prisma/client';
import { config } from 'src/common';
import { PrismaService } from 'src/prisma';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordResetService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createOrReplace(userId: string, email: string): Promise<void> {
    const data: Prisma.PasswordResetUncheckedCreateInput = {
      userId: userId,
      attempts: 0,
      code: this.generateCode(),
      createdAt: new Date(),
      expiresAt: this.expiresAt(),
    };

    await this.prismaService.passwordReset.upsert({
      where: { userId },
      create: data,
      update: data,
    });

    // TODO: Implement email sending
    console.warn(`Email sending feature is not implemented. ${email}`);
  }

  public async setPassword(
    userId: string,
    code: string,
    password: string,
  ): Promise<void> {
    await this.checkBeforeReset(userId, code);

    const hash = await argon2.hash(password);

    await this.prismaService.passwordReset.delete({
      where: { userId },
    });

    await this.prismaService.user.update({
      where: { id: userId },
      data: { hash },
    });
  }

  private generateCode(): string {
    const { min, max } = config.password.code;
    const value = randomInt(min, max + 1);
    const length = String(max).length;

    return String(value).padStart(length, '0');
  }

  private expiresAt(): Date {
    const { expirationDays } = config.password.code;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    return expiresAt;
  }

  private async checkBeforeReset(userId: string, code: string): Promise<void> {
    const data = await this.prismaService.passwordReset.findFirst({
      where: {
        userId,
        expiresAt: { gte: new Date() },
      },
    });

    if (!data) {
      throw new UnauthorizedException('Wrong reset code');
    }

    if (data.code !== code) {
      await this.prismaService.passwordReset.update({
        where: { userId },
        data: { attempts: data.attempts + 1 },
      });
      throw new UnauthorizedException('Wrong reset code');
    }

    if (data.attempts > config.password.code.attempts) {
      throw new UnauthorizedException('Attempts exceeded');
    }
  }
}
