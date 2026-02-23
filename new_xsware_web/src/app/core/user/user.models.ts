export interface UserInfo {
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
  isAvatar: boolean;
  version: number;
}

export interface UpdateUserInfoRequest {
  firstName: string;
  lastName: string;
  phone: string;
  version: number;
}