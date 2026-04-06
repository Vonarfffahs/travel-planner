import type {
  CalculatedPlacesPath,
  CalculateTripResponse,
  Trip,
  CreateTripRequest,
} from '../types';

export const tripMapper = {
  toCalculateResponse: (trip: Trip): CalculateTripResponse => {
    return {
      algorithmId: trip.algorithm.id,
      algorithmName: trip.algorithm.name,
      totalValue: trip.totalValue,
      totalCost: trip.totalCost,
      totalTime: trip.totalTime,
      calculationTime: trip.calculationTime,
      parameters: trip.parameters,
      path: trip.tripSteps.map((tripStep) => ({
        ...tripStep.historicPlace,
        visitOrder: tripStep.visitOrder,
      })) as CalculatedPlacesPath[],
    };
  },

  toCreateRequest: (
    calculatedTrip: CalculateTripResponse,
    tripName: string,
    costLimit: number,
    timeLimit: number,
    userId: string,
  ): CreateTripRequest => {
    return {
      name: tripName,
      maxCostLimit: costLimit,
      maxTimeLimit: timeLimit,
      algorithmId: calculatedTrip.algorithmId,
      parameters: calculatedTrip.parameters || undefined,
      userId: userId,
      totalValue: calculatedTrip.totalValue,
      totalCost: calculatedTrip.totalCost,
      totalTime: calculatedTrip.totalTime,
      calculationTime: calculatedTrip.calculationTime,
      path: [...calculatedTrip.path]
        .sort((a, b) => a.visitOrder - b.visitOrder)
        .map((place) => place.id),
    };
  },
};
