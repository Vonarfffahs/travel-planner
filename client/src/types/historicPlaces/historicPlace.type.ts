export interface HistoricPlace {
  id: string;
  name: string;
  coordX: number; // lng - longtitude (довгота)
  coordY: number; // lat - latitude (широта)
  historicValue: number;
  daysToVisit: number;
}
