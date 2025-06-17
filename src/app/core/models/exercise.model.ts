// src/app/core/models/exercise.model.ts
export interface Exercise {
  _id?: string;
  title: string;
  description: string;
  course: string; // ID du cours associé
  questions: string[]; // IDs des questions
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}