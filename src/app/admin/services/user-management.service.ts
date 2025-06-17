// src/app/admin/services/user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  constructor(private http: HttpClient) { }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    console.log('Demande de récupération des utilisateurs');
    
    // Version simplifiée pour le débogage
    return this.http.get<any>(`${environment.apiUrl}/users`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API:', response);
          
          // Vérification explicite du format de la réponse
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          } else if (response && Array.isArray(response)) {
            return response;
          } else {
            console.error('Format de réponse non reconnu:', response);
            return [];
          }
        })
      );
  }

  // Récupérer un utilisateur par son ID
  getUserById(id: string): Observable<User> {
    console.log('Demande de récupération de l\'utilisateur avec ID:', id);
    
    // Version simplifiée pour le débogage
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API pour getUserById:', response);
          
          // Vérification explicite du format de la réponse
          if (response && response.success && response.data) {
            return response.data;
          } else if (response && !response.success) {
            console.error('L\'API a renvoyé une erreur:', response.message || 'Erreur inconnue');
            throw new Error(response.message || 'Erreur lors de la récupération de l\'utilisateur');
          } else if (response && typeof response === 'object' && !('success' in response)) {
            // Si la réponse est l'utilisateur lui-même
            return response;
          } else {
            console.error('Format de réponse non reconnu dans getUserById:', response);
            throw new Error('Format de réponse non reconnu');
          }
        })
      );
  }

  // Ajouter un utilisateur
  addUser(user: User): Observable<User> {
    return this.http.post<{ success: boolean, data: User }>(`${environment.apiUrl}/users`, user)
      .pipe(
        map(response => response.data)
      );
  }

  // Mettre à jour un utilisateur
  updateUser(id: string, user: Partial<User>): Observable<User> {
    console.log('Demande de mise à jour pour l\'utilisateur avec ID:', id);
    console.log('Données à mettre à jour:', user);
    
    return this.http.put<any>(`${environment.apiUrl}/users/${id}`, user)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API pour updateUser:', response);
          
          // Vérification explicite du format de la réponse
          if (response && response.success && response.data) {
            return response.data;
          } else if (response && !response.success) {
            console.error('L\'API a renvoyé une erreur:', response.message || 'Erreur inconnue');
            throw new Error(response.message || 'Erreur lors de la mise à jour de l\'utilisateur');
          } else if (response && typeof response === 'object' && !('success' in response)) {
            // Si la réponse est l'utilisateur lui-même
            return response;
          } else {
            console.error('Format de réponse non reconnu dans updateUser:', response);
            throw new Error('Format de réponse non reconnu');
          }
        })
      );
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<any> {
    console.log('Demande de suppression de l\'utilisateur avec ID:', id);
    
    return this.http.delete<any>(`${environment.apiUrl}/users/${id}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API pour deleteUser:', response);
          
          // Vérification explicite du format de la réponse
          if (response && response.success) {
            return response;
          } else if (response && !response.success) {
            console.error('L\'API a renvoyé une erreur:', response.message || 'Erreur inconnue');
            throw new Error(response.message || 'Erreur lors de la suppression de l\'utilisateur');
          } else if (response && typeof response === 'object') {
            // Si la réponse a un format non standard mais semble être un objet valide
            return response;
          } else {
            console.error('Format de réponse non reconnu dans deleteUser:', response);
            throw new Error('Format de réponse non reconnu');
          }
        })
      );
  }
}