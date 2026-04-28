import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, PrismaService } from './prisma';
import { HistoricPlacesModule } from './historic-places';
import { TripsModule } from './trips';
import { AlgorithmsModule } from './algorithms';
import { UsersModule } from './users';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    PrismaModule,
    HistoricPlacesModule,
    TripsModule,
    AlgorithmsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
