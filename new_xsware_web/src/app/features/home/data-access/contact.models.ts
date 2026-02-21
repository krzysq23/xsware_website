export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}