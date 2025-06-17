// src/app/core/models/progression.model.ts
export interface Progression {
  _id?: string;
  user: string; // ID de l'utilisateur
  course: string; // ID du cours
  completed: boolean;
  progress: number; // 0-100%
  lastAccessed?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}