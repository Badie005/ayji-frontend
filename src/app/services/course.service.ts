// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { CourseService as EnhancedCourseService } from '../cours/services/course.service';
import { Observable } from 'rxjs';
import { Course } from '../core/models/course.model';

/**
 * @deprecated Utiliser le service amélioré dans cours/services/course.service.ts à la place.
 * Ce service est maintenu temporairement pour garantir la compatibilité pendant la migration.
 */
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  
  constructor(private enhancedService: EnhancedCourseService) { }
  
  getAllCourses(): Observable<Course[]> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.getAllCourses() as Observable<Course[]>;
  }
  
  getCourseById(id: string): Observable<Course> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.getCourseById(id) as Observable<Course>;
  }
  
  getCoursesBySubject(subjectId: string): Observable<Course[]> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.getCoursesBySubject(subjectId) as Observable<Course[]>;
  }
  
  createCourse(courseData: Course): Observable<Course> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.createCourse(courseData) as Observable<Course>;
  }
  
  updateCourse(id: string, courseData: Partial<Course>): Observable<Course> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.updateCourse(id, courseData as Course) as Observable<Course>;
  }
  
  deleteCourse(id: string): Observable<any> {
    console.warn('Utilisation d\'un service déprécié. Migrer vers le service dans cours/services/course.service.ts');
    return this.enhancedService.deleteCourse(id);
  }
}