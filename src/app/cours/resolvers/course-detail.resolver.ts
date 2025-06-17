import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, catchError, tap, EMPTY } from 'rxjs';
import { Course } from '../../core/models/course.model';
import { CourseService } from '../services/course.service';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailResolver implements Resolve<Course | null> {
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Course | null> {
    console.log(`CourseDetailResolver: Démarrage de la résolution pour ${state.url}`);
    
    // Vérifier si l'utilisateur est authentifié
    if (!this.authService.isLoggedIn()) {
      console.error('CourseDetailResolver: Utilisateur non authentifié');
      
      // IMPORTANT: Ne pas rediriger ici pour éviter le conflit de navigation
      // Au lieu de cela, retourner null et laisser le composant gérer cela
      return of(null);
    }
    
    const courseId = route.paramMap.get('id');
    
    if (!courseId) {
      console.error('CourseDetailResolver: Aucun ID de cours spécifié');
      return of(null);
    }
    
    console.log(`CourseDetailResolver: Chargement du cours ${courseId}`);
    
    return this.courseService.getCourseById(courseId).pipe(
      tap(course => {
        console.log('CourseDetailResolver: Cours récupéré:', course);
      }),
      catchError(error => {
        console.error('CourseDetailResolver: Erreur lors de la récupération du cours:', error);
        // Ne pas naviguer, simplement retourner null
        return of(null);
      })
    );
  }
}
