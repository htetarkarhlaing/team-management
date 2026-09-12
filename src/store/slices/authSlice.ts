import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, PersistedAuth } from "@/types/auth";

const initialState: AuthState = {
  username: null,
  isAuthenticated: false,
  isHydrated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload.trim();
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = null;
      state.isAuthenticated = false;
    },
    setHydrated: (state, action: PayloadAction<PersistedAuth | undefined>) => {
      if (action.payload) {
        state.username = action.payload.username;
        state.isAuthenticated = action.payload.isAuthenticated;
      }
      state.isHydrated = true;
    },
  },
});

export const { login, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;
