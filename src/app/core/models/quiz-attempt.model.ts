// src/app/core/models/quiz-attempt.model.ts
export interface QuizAttempt {
  _id?: string;
  user: string; // ID de l'utilisateur
  exercise: string; // ID de l'exercice
  answers: {
    question: string; // ID de la question
    selectedOptions: string[]; // IDs des options sélectionnées
  }[];
  score: number;
  maxScore: number;
  completed: boolean;
  startedAt: Date;
  finishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}