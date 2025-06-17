import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CourseProgress } from '../models/progress.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Service qui gère les progressions spécifiques à chaque utilisateur
 */
@Injectable({
  providedIn: 'root'
})
export class UserProgressService {
  // Clé de stockage spécifique à l'utilisateur
  private readonly USER_PROGRESS_KEY_PREFIX = 'AYJI_USER_PROGRESS_';
  
  // BehaviorSubject pour notifier les composants des changements de progression
  private userProgressionSubject = new BehaviorSubject<CourseProgress[]>([]);
  public userProgression$ = this.userProgressionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Charger les progressions au démarrage du service
    this.loadUserProgressions();
    
    // Écouter les changements d'authentification
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Utilisateur connecté, charger ses progressions
        this.loadUserProgressions();
      } else {
        // Utilisateur déconnecté, vider les progressions
        this.userProgressionSubject.next([]);
      }
    });
  }

  /**
   * Obtient la clé de stockage spécifique à l'utilisateur actuel
   */
  private getUserProgressKey(): string {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser._id) {
      return `${this.USER_PROGRESS_KEY_PREFIX}${currentUser._id}`;
    }
    return `${this.USER_PROGRESS_KEY_PREFIX}temp_session`;
  }

  /**
   * Charge les progressions de l'utilisateur actuel depuis le stockage local
   */
  private loadUserProgressions(): void {
    try {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        console.log('Aucun utilisateur connecté, pas de progression à charger');
        return;
      }

      const progressKey = this.getUserProgressKey();
      const progressData = localStorage.getItem(progressKey);
      
      if (progressData) {
        const progressions = JSON.parse(progressData) as CourseProgress[];
        this.userProgressionSubject.next(progressions);
      } else {
        // Aucune progression locale, essayer de récupérer depuis le serveur
        this.syncFromServer();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des progressions utilisateur:', error);
    }
  }

  /**
   * Synchronise les progressions depuis le serveur
   */
  private syncFromServer(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.token) {
      return;
    }

    this.http.get<any>(`${environment.apiUrl}/progress/user/${currentUser._id}`).pipe(
      map(response => response.data as CourseProgress[]),
      catchError(error => {
        console.error('Erreur lors de la récupération des progressions depuis le serveur:', error);
        return of([]);
      })
    ).subscribe(progressions => {
      if (progressions && progressions.length > 0) {
        // Enregistrer les progressions récupérées localement
        this.userProgressionSubject.next(progressions);
        this.saveUserProgressions(progressions);
      }
    });
  }

  /**
   * Sauvegarde les progressions de l'utilisateur actuel dans le stockage local
   */
  private saveUserProgressions(progressions: CourseProgress[]): void {
    const progressKey = this.getUserProgressKey();
    localStorage.setItem(progressKey, JSON.stringify(progressions));
  }

  /**
   * Met à jour la progression d'un cours pour l'utilisateur actuel
   * @param courseId ID du cours
   * @param updatedProgress Nouvelles données de progression
   */
  updateCourseProgress(courseId: string, updatedProgress: Partial<CourseProgress>): void {
    const currentProgressions = this.userProgressionSubject.getValue();
    let progressions = [...currentProgressions];
    
    // Trouver et mettre à jour la progression existante ou en ajouter une nouvelle
    const existingIndex = progressions.findIndex(p => p.courseId === courseId);
    if (existingIndex !== -1) {
      progressions[existingIndex] = { ...progressions[existingIndex], ...updatedProgress, lastAccessed: new Date() };
    } else {
      const newProgress: CourseProgress = {
        courseId,
        title: `Cours ${courseId}`,
        modules: [],
        completionPercentage: updatedProgress.completionPercentage || 0,
        lastAccessed: new Date()
      };
      progressions.push(newProgress);
    }
    
    // Mettre à jour le BehaviorSubject et sauvegarder localement
    this.userProgressionSubject.next(progressions);
    this.saveUserProgressions(progressions);
    
    // Synchroniser avec le serveur
    this.syncToServer(courseId, updatedProgress);
  }

  /**
   * Envoie les mises à jour de progression au serveur
   */
  private syncToServer(courseId: string, updatedProgress: Partial<CourseProgress>): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.token) {
      return;
    }

    this.http.post<any>(`${environment.apiUrl}/progress/user/${currentUser._id}/course/${courseId}`, updatedProgress)
      .pipe(
        catchError(error => {
          console.error('Erreur lors de la sauvegarde de la progression sur le serveur:', error);
          return throwError(() => error);
        })
      ).subscribe();
  }

  /**
   * Récupère toutes les progressions pour l'utilisateur actuel
   * @returns Observable avec la liste des progressions
   */
  getAllUserProgressions(): Observable<CourseProgress[]> {
    return this.userProgression$;
  }

  /**
   * Récupère la progression d'un cours spécifique pour l'utilisateur actuel
   * @param courseId ID du cours
   * @returns Objet de progression du cours ou null si non trouvé
   */
  getCourseProgress(courseId: string): CourseProgress | null {
    const progressions = this.userProgressionSubject.getValue();
    return progressions.find(p => p.courseId === courseId) || null;
  }

  /**
   * Récupère le pourcentage de progression pour un cours spécifique
   * @param courseId ID du cours
   * @returns Pourcentage de progression (0-100)
   */
  getCourseProgressPercentage(courseId: string): number {
    const progress = this.getCourseProgress(courseId);
    return progress ? progress.completionPercentage : 0;
  }
}
