import type {
  Algorithm,
  CalculateTripRequest,
  CalculateTripResponse,
} from '../types';
import type { GetResponse } from '../types/common';
import { apiClient } from './axios';

export const algorithmsAPI = {
  // calculate route function
  calculateTrip: async (
    data: CalculateTripRequest,
  ): Promise<CalculateTripResponse> => {
    const response = await apiClient.post<CalculateTripResponse>(
      '/algorithms/calculate',
      data,
    );
    return response.data;
  },

  // get algorithms data
  getAlgorithms: async (): Promise<GetResponse<Algorithm>> => {
    const response = await apiClient.get<GetResponse<Algorithm>>('/algorithms');
    return response.data;
  },
};
