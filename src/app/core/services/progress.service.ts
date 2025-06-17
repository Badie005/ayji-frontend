import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Progression } from '../models/progression.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la progression d'un utilisateur pour tous les cours
   * @param userId ID de l'utilisateur
   */
  getUserProgress(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Récupère la progression d'un utilisateur pour un cours spécifique
   * @param userId ID de l'utilisateur
   * @param courseId ID du cours
   */
  getUserCourseProgress(userId: string, courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/course/${courseId}`);
  }

  /**
   * Met à jour la progression d'un utilisateur pour un cours
   * @param userId ID de l'utilisateur
   * @param courseId ID du cours
   * @param progressData Données de progression à mettre à jour
   */
  updateUserCourseProgress(userId: string, courseId: string, progressData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/${userId}/course/${courseId}`, progressData);
  }

  /**
   * Enregistre une tentative de QCM
   * @param quizAttemptData Données de la tentative de QCM
   */
  saveQuizAttempt(quizAttemptData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quiz-attempt`, quizAttemptData);
  }

  /**
   * Récupère toutes les tentatives de QCM d'un utilisateur
   * @param userId ID de l'utilisateur
   */
  getUserQuizAttempts(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quiz-attempt/user/${userId}`);
  }

  /**
   * Récupère les réponses d'une tentative de QCM
   * @param attemptId ID de la tentative
   */
  getQuizAttemptAnswers(attemptId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quiz-attempt/${attemptId}/answers`);
  }

  /**
   * Calcule le pourcentage d'avancement en fonction du temps passé sur la page
   * @param totalDuration Durée totale estimée du cours en secondes
   * @param timeSpent Temps passé sur la page en secondes
   * @param currentProgress Progression actuelle (0-100)
   */
  calculateProgressPercentage(totalDuration: number, timeSpent: number, currentProgress: number): number {
    // Calcul basé sur le temps (avec un maximum de progression de 90% basé uniquement sur le temps)
    const timeBasedProgress = Math.min(90, (timeSpent / totalDuration) * 100);
    
    // Si la progression actuelle est supérieure à celle basée sur le temps, on la conserve
    // Sinon, on prend la progression basée sur le temps
    return Math.max(currentProgress, timeBasedProgress);
  }

  /**
   * Détermine le statut de progression en fonction du pourcentage
   * @param percentage Pourcentage de progression (0-100)
   */
  determineStatus(percentage: number): string {
    if (percentage === 0) {
      return 'Non commencé';
    } else if (percentage < 100) {
      return 'En cours';
    } else {
      return 'Terminé';
    }
  }
}
