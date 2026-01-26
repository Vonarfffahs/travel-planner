import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { HistoricPlacesModule } from './historic-places/historic-places.module';

@Module({
  imports: [ConfigModule.forRoot(), HistoricPlacesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
