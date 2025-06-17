import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces pour les réponses API
export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
  error?: string;
}

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  token?: string;
  isAuthenticated?: boolean;
  droits?: string;
  anneeScolaire?: string;
  filiere?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    // Récupérer l'utilisateur du stockage au démarrage
    let storedUser = localStorage.getItem('currentUser');

    // Si pas dans localStorage, vérifier dans sessionStorage
    if (!storedUser) {
      storedUser = sessionStorage.getItem('currentUser');
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Getter pour obtenir la valeur actuelle de l'utilisateur
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: any): Observable<User> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      map(response => {
        const user = response.data;
        // Stocker l'utilisateur en local storage
        this.storeUserData(user, true);
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer(user.token);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('AuthService.register - Erreur détaillée:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        return throwError(() => error);
      })
    );
  }

  /**
   * Connecte un utilisateur avec des identifiants et optionnellement conserve la session
   */
  login(email: string, password: string, rememberMe: boolean = false): Observable<LoginResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      map(response => {
        if (response.success) {
          const user = response.data as User;

          // S'assurer que le champ isAuthenticated existe
          user.isAuthenticated = true;

          this.storeUserData(user, rememberMe);

          // Notifier les abonnés du changement d'état d'authentification
          this.currentUserSubject.next(user);

          // Démarrer le timer de rafraîchissement du token
          this.startRefreshTokenTimer(user.token);

          return { user, token: user.token || '' };
        } else {
          throw new Error(response.message);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la connexion:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Rafraîchit le token JWT
   */
  refreshToken(): Observable<User> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/refresh-token`, {}).pipe(
      map(response => {
        const user = response.data as User;
        // Mettre à jour le stockage
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        this.storeUserData(user, rememberMe);
        this.currentUserSubject.next(user);
        this.startRefreshTokenTimer(user.token);
        return user;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Déconnecte l'utilisateur et nettoie les données stockées
   */
  logout(): Observable<any> {
    // Appel au backend pour invalider le token
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.completeLogout()),
      catchError(error => {
        this.completeLogout();
        return of(null);
      })
    );
  }

  private completeLogout(): void {
    // Nettoyer le timer de rafraîchissement du token
    this.stopRefreshTokenTimer();

    // Supprimer l'utilisateur des deux stockages
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');

    // Réinitialiser l'état d'authentification
    this.currentUserSubject.next(null);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Obtenir le rôle de l'utilisateur
  getUserRole(): string | null {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.role ? currentUser.role : null;
  }

  // Récupérer l'utilisateur actuel depuis le serveur
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse>(`${environment.apiUrl}/auth/me`).pipe(
      map(response => {
        if (response.success) {
          return response.data as User;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        // En cas d'erreur, forcer la déconnexion
        this.completeLogout();
        return throwError(() => error);
      })
    );
  }

  // Stocker les données utilisateur selon le choix "Se souvenir de moi"
  private storeUserData(user: User, rememberMe: boolean): void {
    if (rememberMe) {
      // Stockage persistant avec localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('rememberMe', 'true');
      sessionStorage.removeItem('currentUser');
    } else {
      // Stockage de session uniquement
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.removeItem('currentUser');
      localStorage.setItem('rememberMe', 'false');
    }
  }

  // Démarrer le timer de rafraîchissement du token
  private startRefreshTokenTimer(token?: string): void {
    if (!token) return;

    // Décoder le token pour obtenir l'expiration
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);

    // Définir un délai pour rafraîchir le token à 60 secondes avant l'expiration
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  // Arrêter le timer de rafraîchissement du token
  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}
