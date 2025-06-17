// src/app/core/models/question.model.ts
export interface Question {
  _id?: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in' | 'matching';
  options: Option[];
  correctAnswers: string[]; // IDs des options correctes
  points: number;
  exercise: string; // ID de l'exercice
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Option {
  _id?: string;
  text: string;
  isCorrect: boolean;
}