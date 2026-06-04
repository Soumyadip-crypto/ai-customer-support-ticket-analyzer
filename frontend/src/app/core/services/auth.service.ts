import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = "http://localhost:5000/api/auth";
  private tokenkey = 'ticket_token';
  private userKey = 'ticket_user';
  private http = inject(HttpClient);
  register(data: {
    name: string,
    email: string,
    password: string,
    role?: string
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }
  login(data: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data)
  }
  saveAuth(response: AuthResponse) {
    localStorage.setItem(this.tokenkey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user))
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenkey);
  }
  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout(): void {
    localStorage.removeItem(this.tokenkey);
    localStorage.removeItem(this.userKey);
  }

}
