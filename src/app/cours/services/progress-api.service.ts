import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CourseProgress, ModuleProgress, QCMProgress, PDFProgress } from '../models/progress.model';
import { ApiResponse } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressApiService {
  private readonly API_URL = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la progression pour tous les cours de l'utilisateur courant
   * @returns Observable avec toutes les progressions de cours de l'utilisateur
   */
  getAllProgress(): Observable<CourseProgress[]> {
    return this.http.get<ApiResponse>(`${this.API_URL}`).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress[];
        }
        throw new Error(response.message || 'Erreur lors de la récupération des données de progression');
      }),
      catchError(this.handleError)
    );
  }
  
  /**
   * Récupère la progression pour tous les cours d'un utilisateur spécifique
   * Utilisable uniquement par les administrateurs
   * @param userId ID de l'utilisateur dont on veut récupérer les progressions
   * @returns Observable avec toutes les progressions de cours de l'utilisateur spécifié
   */
  getUserProgressions(userId: string): Observable<CourseProgress[]> {
    return this.http.get<ApiResponse>(`${this.API_URL}/user/${userId}`).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress[];
        }
        throw new Error(response.message || `Erreur lors de la récupération des données de progression pour l'utilisateur ${userId}`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère la progression pour un cours spécifique
   * @param courseId ID du cours
   * @returns Observable avec la progression du cours
   */
  getCourseProgress(courseId: string): Observable<CourseProgress> {
    return this.http.get<ApiResponse>(`${this.API_URL}/${courseId}`).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress;
        }
        throw new Error(response.message || `Erreur lors de la récupération de la progression pour le cours ${courseId}`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Enregistre ou met à jour la progression d'un cours
   * @param courseProgress Objet de progression du cours à sauvegarder
   * @returns Observable avec la progression mise à jour
   */
  saveCourseProgress(courseProgress: CourseProgress): Observable<CourseProgress> {
    return this.http.post<ApiResponse>(`${this.API_URL}/${courseProgress.courseId}`, courseProgress).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress;
        }
        throw new Error(response.message || 'Erreur lors de la sauvegarde de la progression');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour la progression d'un QCM spécifique
   * @param courseId ID du cours
   * @param moduleId ID du module
   * @param qcmProgress Données de progression du QCM
   * @returns Observable avec la progression mise à jour
   */
  updateQCMProgress(courseId: string, moduleId: string, qcmProgress: QCMProgress): Observable<CourseProgress> {
    return this.http.post<ApiResponse>(`${this.API_URL}/${courseId}/modules/${moduleId}/qcm`, qcmProgress).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour de la progression du QCM');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour la progression d'un document PDF spécifique
   * @param courseId ID du cours
   * @param moduleId ID du module
   * @param pdfProgress Données de progression du PDF
   * @returns Observable avec la progression mise à jour
   */
  updatePDFProgress(courseId: string, moduleId: string, pdfProgress: PDFProgress): Observable<CourseProgress> {
    return this.http.post<ApiResponse>(`${this.API_URL}/${courseId}/modules/${moduleId}/pdf`, pdfProgress).pipe(
      map(response => {
        if (response.success) {
          return response.data as CourseProgress;
        }
        throw new Error(response.message || 'Erreur lors de la mise à jour de la progression du PDF');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime toutes les données de progression pour un utilisateur (reset)
   * @returns Observable confirmant la suppression
   */
  resetAllProgress(): Observable<boolean> {
    return this.http.delete<ApiResponse>(`${this.API_URL}`).pipe(
      map(response => {
        return response.success;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP
   * @param error Erreur HTTP
   * @returns Observable d'erreur
   */
  private handleError(error: HttpErrorResponse) {
    console.error('ProgressApiService - Erreur détaillée:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message
    });
    return throwError(() => error);
  }
}
