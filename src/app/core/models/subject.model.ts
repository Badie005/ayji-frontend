// src/app/core/models/subject.model.ts
export interface Subject {
  _id?: string;
  name: string;
  description: string;
  image?: string;
  courses?: string[]; // IDs des cours associés
  createdAt?: Date;
  updatedAt?: Date;
}