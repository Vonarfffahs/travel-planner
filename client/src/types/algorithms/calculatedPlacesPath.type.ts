import type { HistoricPlace } from '../historicPlaces';

export interface CalculatedPlacesPath extends HistoricPlace {
  visitOrder: number;
}
