import type { HistoricPlace } from '../historicPlaces';

export interface TripStep {
  id: string;
  visitOrder: number;
  historicPlace: HistoricPlace;
}
