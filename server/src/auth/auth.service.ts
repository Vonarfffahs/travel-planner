import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessDTO, LoginDataDTO, LoginDTO } from './dto';
import { PrismaService } from 'src/prisma';
import { mapUserRoleFromDB, mapUserStatusFromDB } from 'src/users/mappers';
import { UserStatus } from 'src/users/dto';
import { config, Hasher } from 'src/common';
import { UserJWT } from './models';
import { ProfileService } from 'src/users';

const ERROR_MESSAGE = 'Wrong email or password';

@Injectable()
export class AuthService {
  private readonly jwt = new UserJWT(
    config.jwt.secret,
    config.jwt.expirationSeconds,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  public async login(data: LoginDTO): Promise<AccessDTO> {
    const user = await this.retrieveForLogin(data.email);
    this.checkLoginPermission(user);

    const match = await Hasher.verify(user.hash, data.password);
    if (!match) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    const token = await this.jwt.sign(user.id, user.role);
    const profile = await this.profileService.getSelf(user.id);

    return {
      ...profile,
      token,
    };
  }

  private async retrieveForLogin(email: string): Promise<LoginDataDTO> {
    const data = await this.prismaService.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: {
        id: true,
        hash: true,
        role: true,
        status: true,
      },
    });

    if (!data || !data.hash) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }

    return {
      id: data.id,
      hash: data.hash,
      role: mapUserRoleFromDB(data.role),
      status: mapUserStatusFromDB(data.status),
    };
  }

  private checkLoginPermission(user: LoginDataDTO): void {
    if (user.status !== UserStatus.Active) {
      throw new UnauthorizedException(ERROR_MESSAGE);
    }
  }
}
