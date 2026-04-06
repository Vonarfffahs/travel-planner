import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice';

export const store = configureStore({
  reducer: {
    trip: tripReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
