import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CalculateTripResponse } from '../types/algorithms';
import type { HistoricPlace } from '../types';

interface TripState {
  id: string | null;
  calculatedTrip: CalculateTripResponse | null;
  maxCostLimit: number | null;
  maxTimeLimit: number | null;
  tripName: string | null;
  historicPlaces: HistoricPlace[];
}

const initialState: TripState = {
  id: null,
  calculatedTrip: null,
  maxCostLimit: null,
  maxTimeLimit: null,
  tripName: null,
  historicPlaces: [],
};

export interface SetTripPayload {
  id?: string;
  trip: CalculateTripResponse;
  maxCostLimit: number;
  maxTimeLimit: number;
  tripName?: string;
}

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setCalculatedTrip: (
      state,
      action: PayloadAction<SetTripPayload | null>,
    ) => {
      if (action.payload) {
        state.id = action.payload.id || null; // Зберігаємо ID
        state.calculatedTrip = action.payload?.trip;
        state.maxCostLimit = action.payload.maxCostLimit;
        state.maxTimeLimit = action.payload.maxTimeLimit;
        state.tripName = action.payload.tripName || '';
      } else {
        state.id = null;
        state.calculatedTrip = null;
        state.maxCostLimit = null;
        state.maxTimeLimit = null;
        state.tripName = null;
      }
    },

    clearTrip: (state) => {
      state.id = null;
      state.calculatedTrip = null;
      state.maxCostLimit = null;
      state.maxTimeLimit = null;
      state.tripName = null;
    },

    setHistoricPlaces: (state, action) => {
      state.historicPlaces = action.payload;
    },
  },
});

export const { setCalculatedTrip, clearTrip, setHistoricPlaces } =
  tripSlice.actions;

export default tripSlice.reducer;
