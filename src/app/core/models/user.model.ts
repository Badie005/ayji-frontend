// src/app/core/models/user.model.ts
export interface User {
  _id?: string;
  id?: string; // Gardé pour compatibilité avec d'autres composants existants
  nom: string;
  prenom: string;
  email: string;
  role?: string; // Ajout du champ rôle
  token?: string; // Pour stocker le JWT
  createdAt?: Date;
  updatedAt?: Date;
}