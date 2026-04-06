import type { HistoricPlace } from '../types';
import type { GetResponse } from '../types/common';
import { apiClient } from './axios';

export const historicPlacesAPI = {
  getHistoricPlaces: async (): Promise<GetResponse<HistoricPlace>> => {
    const response =
      await apiClient.get<GetResponse<HistoricPlace>>('/historic-places');
    return response.data;
  },
};
