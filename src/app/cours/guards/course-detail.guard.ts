import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseDetailGuard {
  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Récupération de l'ID du cours depuis les paramètres de la route
    const courseId = route.paramMap.get('id');
    
    if (!courseId) {
      console.error('CourseDetailGuard: Aucun ID de cours spécifié');
      this.router.navigate(['/cours']);
      return of(false);
    }
    
    console.log(`CourseDetailGuard: Vérification de l'existence du cours ${courseId}`);
    
    // On vérifie que le cours existe avant d'autoriser l'accès à la route
    return this.courseService.getCourseById(courseId).pipe(
      tap(course => {
        console.log('CourseDetailGuard: Cours trouvé:', course);
      }),
      map(course => {
        if (course) {
          return true;
        } else {
          console.error(`CourseDetailGuard: Cours ${courseId} non trouvé`);
          // Ne pas rediriger pour éviter la boucle de redirection
          return false;
        }
      }),
      catchError(error => {
        console.error('CourseDetailGuard: Erreur lors de la récupération du cours:', error);
        // Ne pas rediriger pour éviter la boucle de redirection
        return of(false);
      })
    );
  }
}
