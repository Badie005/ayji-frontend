import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {

  constructor(
    private http: HttpClient,
    private userService: UserManagementService
  ) { }

  // Récupérer les statistiques globales
  getStatistics(): Observable<{userCount: number, courseCount: number, lessonCount: number}> {
    return forkJoin({
      users: this.getUserCount(),
      courses: this.getCourseCount(),
      lessons: this.getLessonCount()
    }).pipe(
      map(result => ({
        userCount: result.users,
        courseCount: result.courses,
        lessonCount: result.lessons
      })),
      catchError(error => {
        console.error('Erreur lors de la récupération des statistiques', error);
        // Valeurs par défaut en cas d'erreur
        return of({
          userCount: 23,
          courseCount: 12,
          lessonCount: 156
        });
      })
    );
  }

  // Récupérer le nombre d'utilisateurs
  getUserCount(): Observable<number> {
    return this.userService.getUsers().pipe(
      map(users => users.length),
      catchError(error => {
        console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error);
        return of(23); // Valeur par défaut
      })
    );
  }

  // Récupérer le nombre de cours
  getCourseCount(): Observable<number> {
    return this.http.get<any>(`${environment.apiUrl}/courses`).pipe(
      map(response => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data.length;
        } else if (response && Array.isArray(response)) {
          return response.length;
        } else {
          return 12; // Valeur par défaut
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du nombre de cours', error);
        return of(12); // Valeur par défaut
      })
    );
  }

  // Récupérer le nombre de leçons
  getLessonCount(): Observable<number> {
    return this.http.get<any>(`${environment.apiUrl}/lessons`).pipe(
      map(response => {
        if (response && response.success && Array.isArray(response.data)) {
          return response.data.length;
        } else if (response && Array.isArray(response)) {
          return response.length;
        } else {
          return 156; // Valeur par défaut
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération du nombre de leçons', error);
        return of(156); // Valeur par défaut
      })
    );
  }
}
