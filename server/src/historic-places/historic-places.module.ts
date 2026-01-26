import { Module } from '@nestjs/common';
import { HistoricPlacesService } from './historic-places.service';
import { HistoricPlacesController } from './historic-places.controller';

@Module({
  controllers: [HistoricPlacesController],
  providers: [HistoricPlacesService],
})
export class HistoricPlacesModule {}
