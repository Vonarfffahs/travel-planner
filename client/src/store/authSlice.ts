import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const LOCALSTORAGE_TOKEN_NAME = 'access_token';
const initialToken = localStorage.getItem(LOCALSTORAGE_TOKEN_NAME);

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: initialToken,
  isAuthenticated: !!initialToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem(LOCALSTORAGE_TOKEN_NAME, action.payload.token);
    },

    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(LOCALSTORAGE_TOKEN_NAME);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
