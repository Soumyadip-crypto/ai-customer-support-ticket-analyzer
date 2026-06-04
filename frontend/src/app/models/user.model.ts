export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'support' | 'admin';
}
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}