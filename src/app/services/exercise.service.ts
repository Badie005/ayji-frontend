// src/app/services/exercise.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exercise } from '../core/models/exercise.model';
import { Question } from '../core/models/question.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = `${environment.apiUrl}/exercises`;
  
  constructor(private http: HttpClient) { }
  
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }
  
  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }
  
  getExercisesByCourse(courseId: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/course/${courseId}`);
  }
  
  getQuestionsByExerciseId(exerciseId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${exerciseId}/questions`);
  }
  
  createExercise(exerciseData: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exerciseData);
  }
  
  updateExercise(id: string, exerciseData: Partial<Exercise>): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exerciseData);
  }
  
  deleteExercise(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}