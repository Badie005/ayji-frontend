// src/app/services/utilisateur.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Utilisateur {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private endpoint = 'utilisateurs';
  
  constructor(private apiService: ApiService) { }
  
  // Récupérer tous les utilisateurs
  getAllUtilisateurs(): Observable<Utilisateur[]> {
    return this.apiService.get<Utilisateur[]>(this.endpoint);
  }
  
  // Récupérer un utilisateur par ID
  getUtilisateurById(id: string): Observable<Utilisateur> {
    return this.apiService.get<Utilisateur>(`${this.endpoint}/${id}`);
  }
  
  // Créer un nouvel utilisateur
  createUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.apiService.post<Utilisateur>(this.endpoint, utilisateur);
  }
  
  // Mettre à jour un utilisateur
  updateUtilisateur(id: string, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.apiService.put<Utilisateur>(`${this.endpoint}/${id}`, utilisateur);
  }
  
  // Supprimer un utilisateur
  deleteUtilisateur(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}
