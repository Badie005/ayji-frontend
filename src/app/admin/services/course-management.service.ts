// src/app/admin/services/course-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Course } from '../../core/models/course.model';
import { environment } from '../../../environments/environment';

interface ApiResponse {
  success: boolean;
  data: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseManagementService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  // Récupérer tous les cours
  getCourses(): Observable<Course[]> {
    console.log('Demande de récupération des cours');
    
    return this.http.get<any>(`${this.apiUrl}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API:', response);
          
          if (response && response.success && Array.isArray(response.data)) {
            return this.mapApiCoursesToModel(response.data);
          } else if (response && Array.isArray(response)) {
            return this.mapApiCoursesToModel(response);
          } else if (response && response.data && Array.isArray(response.data)) {
            return this.mapApiCoursesToModel(response.data);
          } else {
            console.error('Format de réponse non reconnu:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('Erreur lors de la récupération des cours', error);
          throw error;
        })
      );
  }

  // Récupérer l'ordre maximum actuel
  getMaxOrder(): Observable<number> {
    return this.getCourses().pipe(
      map(courses => {
        if (courses.length === 0) return 0;
        const maxOrder = Math.max(...courses.map(course => course.order || 0));
        return maxOrder;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de l\'ordre maximum', error);
        return of(0);
      })
    );
  }

  // Récupérer un cours par son ID
  getCourseById(id: string): Observable<Course> {
    console.log(`Demande de récupération du cours avec ID: ${id}`);
    
    return this.http.get<any>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => {
          console.log('Réponse brute de l\'API pour getCourseById:', response);
          
          if (response && response.success && response.data) {
            return this.mapApiCourseToModel(response.data);
          } else if (response && !response.success) {
            console.error('L\'API a renvoyé une erreur:', response.message || 'Erreur inconnue');
            throw new Error(response.message || 'Erreur lors de la récupération du cours');
          } else if (response && typeof response === 'object' && !('success' in response)) {
            return this.mapApiCourseToModel(response);
          } else {
            console.error('Format de réponse non reconnu dans getCourseById:', response);
            throw new Error('Format de réponse non reconnu');
          }
        }),
        catchError(error => {
          console.error(`Erreur lors de la récupération du cours ${id}`, error);
          throw error;
        })
      );
  }

  // Ajouter un cours
  addCourse(course: Partial<Course>): Observable<Course> {
    console.log('Données du cours à ajouter:', course);
    
    // Convertir en format API
    const apiCourse = this.mapModelToApiCourse(course);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}`, apiCourse)
      .pipe(
        map(response => {
          console.log('Réponse après ajout:', response);
          if (response && response.success && response.data) {
            return this.mapApiCourseToModel(response.data);
          } else {
            throw new Error(response.message || 'Erreur lors de l\'ajout du cours');
          }
        }),
        catchError(error => {
          console.error('Erreur lors de l\'ajout du cours', error);
          throw error;
        })
      );
  }

  // Mettre à jour un cours
  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    console.log(`Demande de mise à jour pour le cours avec ID: ${id}`);
    console.log('Données à mettre à jour:', course);
    
    // Convertir en format API
    const apiCourse = this.mapModelToApiCourse(course);
    
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, apiCourse)
      .pipe(
        map(response => {
          console.log('Réponse après mise à jour:', response);
          if (response && response.success && response.data) {
            return this.mapApiCourseToModel(response.data);
          } else {
            throw new Error(response.message || 'Erreur lors de la mise à jour du cours');
          }
        }),
        catchError(error => {
          console.error(`Erreur lors de la mise à jour du cours ${id}`, error);
          throw error;
        })
      );
  }

  // Supprimer un cours
  deleteCourse(id: string): Observable<any> {
    console.log(`Demande de suppression du cours avec ID: ${id}`);
    
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(response => console.log('Réponse après suppression:', response)),
        catchError(error => {
          console.error(`Erreur lors de la suppression du cours ${id}`, error);
          throw error;
        })
      );
  }

  // Mapper un cours API vers le modèle d'application
  private mapApiCourseToModel(apiCourse: any): Course {
    // Création de l'URL complète pour les fichiers PDF
    const pdfUrlBase = environment.apiBaseUrl.replace('/api', '');
    const formatPdfUrl = (url: string) => {
      if (!url) return '';
      // Si l'URL est absolue (commence par http), la renvoyer telle quelle
      if (url.startsWith('http')) return url;
      // Si l'URL commence par /, la concaténer avec la base
      return `${pdfUrlBase}${url}`;
    };
    
    return {
      id: apiCourse._id || '',
      _id: apiCourse._id || '',
      title: apiCourse.titre || apiCourse.title || '',
      description: apiCourse.description || '',
      subject: apiCourse.idMatiere || apiCourse.subject || '',
      content: apiCourse.content || '',
      coursePdfUrl: formatPdfUrl(apiCourse.coursePdfUrl || ''),
      exercisePdfUrl: formatPdfUrl(apiCourse.exercisePdfUrl || ''),
      qcmPdfUrl: formatPdfUrl(apiCourse.qcmPdfUrl || ''),
      order: apiCourse.order || 0,
      createdAt: apiCourse.dateCreation ? new Date(apiCourse.dateCreation) : (apiCourse.createdAt ? new Date(apiCourse.createdAt) : undefined),
      updatedAt: apiCourse.dateModification ? new Date(apiCourse.dateModification) : (apiCourse.updatedAt ? new Date(apiCourse.updatedAt) : undefined)
    };
  }
  
  // Mapper plusieurs cours API vers le modèle d'application
  private mapApiCoursesToModel(apiCourses: any[]): Course[] {
    return apiCourses.map(course => this.mapApiCourseToModel(course));
  }
  
  // Mapper un cours du modèle d'application vers le format API
  private mapModelToApiCourse(course: Partial<Course>): any {
    return {
      titre: course.title,
      description: course.description,
      content: course.content,
      coursePdfUrl: course.coursePdfUrl,
      exercisePdfUrl: course.exercisePdfUrl,
      qcmPdfUrl: course.qcmPdfUrl,
      order: course.order
    };
  }
}
