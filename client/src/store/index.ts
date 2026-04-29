import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    trip: tripReducer,
    auth: authReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
