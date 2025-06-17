// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  
  constructor(private http: HttpClient) { }
  
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  createUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }
  
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }
  
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  updatePassword(id: string, passwordData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, passwordData);
  }
}