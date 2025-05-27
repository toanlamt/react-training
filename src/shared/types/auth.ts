export interface User {
    id: string;
    username: string;
    role: 'user' | 'officer';
}
  
export interface LoginCredentials {
    username: string;
    password: string;
}
  
export interface LoginResponse {
    user: User;
    message: string;
}