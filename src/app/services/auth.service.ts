// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  constructor(private http: HttpClient) { }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          // Accéder directement aux propriétés de la réponse
          if (response && response.token) {
            this.storeToken(response.token);
            this.storeUserData(response);
          }
        })
      );
  }
  
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  getUserRole(): string | null {
    const user = this.getUserData();
    return user ? user.role : null;
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
  
  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
  
  private storeUserData(userData: any): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }
  
  private getUserData(): any | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}