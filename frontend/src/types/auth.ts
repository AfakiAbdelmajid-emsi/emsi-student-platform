// src/types/auth.ts
export interface UserData {
  id: string;
  email: string;
  profile_complete: boolean;
}

// src/types/auth.ts
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user_id: string;
  email: string;
  profile_complete: boolean;
}