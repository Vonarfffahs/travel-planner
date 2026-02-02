import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HistoricPlacesModule } from './historic-places/historic-places.module';
import { PrismaModule, PrismaService } from './prisma';
import { TripsModule } from './trips/trips.module';
import { AlgorithmsModule } from './algorithms/algorithms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
