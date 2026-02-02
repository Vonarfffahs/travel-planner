import { ReadAllTripsDTO, ReadTripDTO } from '../dto';
import { TripWithRelations } from './types';

export class ReadTripMapper {
  public mapOne(trip: TripWithRelations): ReadTripDTO {
    return {
      id: trip.id,
      name: trip.name,
      maxCostLimit: trip.maxCostLimit,
      maxTimeLimit: trip.maxTimeLimit,
      totalValue: trip.totalValue,
      totalCost: trip.totalCost,
      totalTime: trip.totalTime,
      calculationTime: trip.calculationTime,
      userId: trip.userId,

      algorithm: {
        id: trip.algorithm.id,
        name: trip.algorithm.name,
        description: trip.algorithm.description,
      },

      parameters: trip.parameters
        ? {
            id: trip.parameters.id,
            alpha: trip.parameters.alpha,
            beta: trip.parameters.beta,
            evaporationRate: trip.parameters.evaporationRate,
            iterations: trip.parameters.iterations,
            antCount: trip.parameters.antCount,
          }
        : null,

      tripSteps: trip.tripSteps.map((step) => ({
        id: step.id,
        visitOrder: step.visitOrder,
        historicPlace: {
          id: step.historicPlace.id,
          name: step.historicPlace.name,
          coordX: step.historicPlace.coordX,
          coordY: step.historicPlace.coordY,
          historicValue: step.historicPlace.historicValue,
          daysToVisit: step.historicPlace.daysToVisit,
        },
      })),
    };
  }

  public mapMany(count: number, data: TripWithRelations[]): ReadAllTripsDTO {
    return {
      count,
      data: data.map((one) => this.mapOne(one)),
    };
  }
}
