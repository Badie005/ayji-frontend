import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { Router } from '@angular/router';

/**
 * Global HTTP error interceptor
 * Catches and processes HTTP errors in a centralized way
 */
export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const errorHandler = inject(ErrorHandlerService);
  const router = inject(Router);
  
  // Vérifier si nous sommes sur une page de détail de cours
  const isViewingCourseDetail = window.location.href.includes('/cours/view/');
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log the error
      console.error('HTTP Error Intercepted:', {
        url: req.url,
        method: req.method,
        status: error.status,
        error: error.error,
        isViewingCourseDetail
      });
      
      // Si nous sommes sur une page de détail de cours, ne pas rediriger
      if (isViewingCourseDetail) {
        console.log('Erreur sur une page de détail de cours - pas de redirection');
        return errorHandler.handleHttpError(error, 'course_detail');
      }
      
      // Handle specific error scenarios
      if (error.status === 401) {
        // Authentication error - redirect to login
        console.log('Authentication error detected - redirecting to login');
        // Clear authentication data
        localStorage.removeItem('currentUser');
        router.navigate(['/login']);
      }
      
      if (error.status === 403) {
        // Authorization error - redirect to forbidden page or home
        console.log('Authorization error detected - insufficient permissions');
        router.navigate(['/']);
      }
      
      // Use the error handler service to process the error
      // Pass the request context to help with debugging
      const context = `${req.method} ${req.url.split('/').slice(-2).join('/')}`;
      return errorHandler.handleHttpError(error, context);
    })
  );
};
