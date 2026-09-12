export interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

export interface PersistedAuth {
  username: string | null;
  isAuthenticated: boolean;
}

export interface RegisteredAccount {
  id: string;
  username: string;
  usernameLower: string;
  passwordHash: string;
  createdAt: string;
}
