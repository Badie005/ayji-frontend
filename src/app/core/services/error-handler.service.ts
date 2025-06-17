import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Error types supported by the application
 */
export enum ErrorType {
  API = 'api_error',
  AUTH = 'auth_error',
  VALIDATION = 'validation_error',
  NETWORK = 'network_error',
  NOT_FOUND = 'not_found_error',
  SERVER = 'server_error',
  TIMEOUT = 'timeout_error',
  CLIENT = 'client_error',
  UNKNOWN = 'unknown_error'
}

/**
 * Interface for standardized error responses
 */
export interface AppError {
  type: ErrorType;
  message: string;
  technical?: string;
  status?: number;
  timestamp: Date;
  path?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private router: Router) { }
  
  /**
   * Handles HTTP errors and returns a standardized error object
   * @param error The HTTP error to handle
   * @param context Optional context string to identify where the error occurred
   * @returns Observable with standardized error
   */
  public handleHttpError(error: HttpErrorResponse, context: string = 'API'): Observable<never> {
    const appError = this.parseHttpError(error, context);
    console.error(`[${context}] Error:`, appError);
    
    // Handle authentication errors
    if (appError.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('currentUser');
      this.router.navigate(['/login']);
    }
    
    return throwError(() => appError);
  }
  
  /**
   * Parses an HTTP error into the application's standard error format
   * @param error The HTTP error to parse
   * @param context Context string to identify the origin
   * @returns Standardized AppError object
   */
  private parseHttpError(error: HttpErrorResponse, context: string): AppError {
    let type: ErrorType;
    let message: string;
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      type = ErrorType.CLIENT;
      message = 'Une erreur est survenue. Veuillez réessayer.';
    } else {
      // Server-side error
      if (!navigator.onLine) {
        type = ErrorType.NETWORK;
        message = 'Problème de connexion. Vérifiez votre connexion internet.';
      } else {
        switch (error.status) {
          case 0:
            type = ErrorType.NETWORK;
            message = 'Impossible de se connecter au serveur.';
            break;
          case 400:
            type = ErrorType.VALIDATION;
            message = this.extractErrorMessage(error) || 'Données invalides.';
            break;
          case 401:
            type = ErrorType.AUTH;
            message = 'Session expirée. Veuillez vous reconnecter.';
            break;
          case 403:
            type = ErrorType.AUTH;
            message = 'Vous n\'avez pas les permissions nécessaires.';
            break;
          case 404:
            type = ErrorType.NOT_FOUND;
            message = 'Ressource non trouvée.';
            break;
          case 408:
            type = ErrorType.TIMEOUT;
            message = 'La requête a expiré. Veuillez réessayer.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            type = ErrorType.SERVER;
            message = 'Problème technique côté serveur. Réessayez plus tard.';
            break;
          default:
            type = ErrorType.UNKNOWN;
            message = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    }
    
    return {
      type,
      message,
      technical: this.getErrorDetails(error),
      status: error.status,
      timestamp: new Date(),
      path: context
    };
  }
  
  /**
   * Extract user-friendly error message from the error response if available
   */
  private extractErrorMessage(error: HttpErrorResponse): string | null {
    try {
      // Extract message from common API response formats
      if (error.error?.message) {
        return error.error.message;
      } else if (error.error?.error) {
        return error.error.error;
      } else if (typeof error.error === 'string') {
        return error.error;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  
  /**
   * Get technical error details for logging
   */
  private getErrorDetails(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Client error: ${error.error.message}`;
    }
    
    return `Server error: ${error.status} ${error.statusText}`;
  }
  
  /**
   * Create a custom application error
   */
  public createError(type: ErrorType, message: string, details?: string): AppError {
    return {
      type,
      message,
      technical: details,
      timestamp: new Date()
    };
  }
}
