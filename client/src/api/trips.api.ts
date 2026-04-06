import type { CreateTripRequest, Trip } from '../types';
import type { GetQueryParams, GetResponse } from '../types/common';
import { apiClient } from './axios';

export const tripsAPI = {
  getTrips: async (params: GetQueryParams): Promise<GetResponse<Trip>> => {
    const response = await apiClient.get<GetResponse<Trip>>('/trips', {
      params,
    });
    return response.data;
  },

  getTripById: async (tripId: string): Promise<Trip> => {
    const response = await apiClient.get<Trip>(`/trips/${tripId}`);
    return response.data;
  },

  postTrip: async (trip: CreateTripRequest): Promise<Trip> => {
    const response = await apiClient.post<Trip>('/trips/create', trip);
    return response.data;
  },

  updateTrip: async (
    tripId: string,
    trip: CreateTripRequest,
  ): Promise<Trip> => {
    const response = await apiClient.put<Trip>(`/trips/${tripId}`, trip);
    return response.data;
  },

  deleteTrip: async (tripId: string): Promise<string> => {
    const response = await apiClient.delete<string>(`/trips/${tripId}`);
    return response.data;
  },
};
