// src/app/services/progression.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Progression } from '../core/models/progression.model';
import { QuizAttempt } from '../core/models/quiz-attempt.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private apiUrl = `${environment.apiUrl}/progressions`;
  private quizApiUrl = `${environment.apiUrl}/quiz-attempts`;
  
  constructor(private http: HttpClient) {
    console.log('URL API Progressions:', this.apiUrl);
  }
  
  getUserProgressions(userId: string): Observable<Progression[]> {
    console.log(`Récupération des progressions pour l'utilisateur ${userId}`);
    
    // Pour le développement : si l'ID est l'ID par défaut, retourner un tableau vide
    if (userId === 'default_user_id') {
      console.log('ID utilisateur par défaut détecté, retour de progressions vides');
      return of([]);
    }
    
    return this.http.get<Progression[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(progressions => console.log(`${progressions.length} progressions récupérées`)),
      catchError(this.handleError('getUserProgressions', []))
    );
  }
  
  getCourseProgression(userId: string, courseId: string): Observable<Progression> {
    console.log(`Récupération de la progression pour le cours ${courseId} et l'utilisateur ${userId}`);
    
    // Pour le développement : si l'ID est l'ID par défaut, retourner un objet vide
    if (userId === 'default_user_id') {
      console.log('ID utilisateur par défaut détecté, retour de progression vide');
      return of({} as Progression);
    }
    
    return this.http.get<Progression>(`${this.apiUrl}/user/${userId}/course/${courseId}`).pipe(
      tap(progression => console.log('Progression récupérée:', progression)),
      catchError(this.handleError<Progression>('getCourseProgression'))
    );
  }
  
  updateProgression(id: string, progressionData: Partial<Progression>): Observable<Progression> {
    console.log(`Mise à jour de la progression ${id}:`, progressionData);
    
    if (id === 'new') {
      // Créer une nouvelle progression
      return this.http.post<Progression>(`${this.apiUrl}`, progressionData).pipe(
        tap(progression => console.log('Nouvelle progression créée:', progression)),
        catchError(this.handleError<Progression>('createProgression'))
      );
    }
    
    return this.http.put<Progression>(`${this.apiUrl}/${id}`, progressionData).pipe(
      tap(progression => console.log('Progression mise à jour:', progression)),
      catchError(this.handleError<Progression>('updateProgression'))
    );
  }
  
  createQuizAttempt(attemptData: Partial<QuizAttempt>): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.quizApiUrl}`, attemptData).pipe(
      tap(attempt => console.log('Tentative QCM créée:', attempt)),
      catchError(this.handleError<QuizAttempt>('createQuizAttempt'))
    );
  }
  
  updateQuizAttempt(id: string, attemptData: Partial<QuizAttempt>): Observable<QuizAttempt> {
    return this.http.put<QuizAttempt>(`${this.quizApiUrl}/${id}`, attemptData).pipe(
      tap(attempt => console.log('Tentative QCM mise à jour:', attempt)),
      catchError(this.handleError<QuizAttempt>('updateQuizAttempt'))
    );
  }
  
  getUserQuizAttempts(userId: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${this.quizApiUrl}/user/${userId}`).pipe(
      tap(attempts => console.log(`${attempts.length} tentatives QCM récupérées`)),
      catchError(this.handleError<QuizAttempt[]>('getUserQuizAttempts', []))
    );
  }
  
  getExerciseAttempts(userId: string, exerciseId: string): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>(`${this.quizApiUrl}/user/${userId}/exercise/${exerciseId}`).pipe(
      tap(attempts => console.log(`${attempts.length} tentatives pour l'exercice récupérées`)),
      catchError(this.handleError<QuizAttempt[]>('getExerciseAttempts', []))
    );
  }
  
  private handleError<T>(operation = 'opération', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} a échoué:`, error);
      
      // Pour le développement, loggons l'erreur et retournons un résultat vide
      if (error.status === 404) {
        console.log(`${operation}: ressource non trouvée`);
      }
      
      // Retourner un résultat vide pour continuer l'application
      return of(result as T);
    };
  }
}