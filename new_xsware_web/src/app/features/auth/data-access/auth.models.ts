export type LoginRequest = { 
  email: string; 
  password: string 
};

export type RegisterRequest = { 
  email: string; 
  password: string; 
  name?: string 
};

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type AuthTokenResponse = { 
  accessToken: string 
};