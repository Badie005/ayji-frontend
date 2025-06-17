// src/app/core/models/course.model.ts
export interface Course {
  id: string;
  _id: string;
  title: string;
  description: string;
  content?: string;
  subject: string;
  subjectId?: string;
  coursePdfUrl?: string;
  exercisePdfUrl?: string;
  qcmPdfUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CourseProgress {
  _id: string;
  userId: string;
  courseId: string;
  progress: number;
  completed: boolean;
  updatedAt: Date;
}