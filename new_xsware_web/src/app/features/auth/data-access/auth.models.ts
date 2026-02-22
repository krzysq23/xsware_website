export type LoginRequest = { 
  email: string; 
  password: string 
};

export type RegisterRequest = { 
  email: string; 
  password: string; 
  name?: string 
};

export type AuthTokenResponse = { 
  accessToken: string 
};