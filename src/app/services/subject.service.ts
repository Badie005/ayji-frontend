// src/app/services/subject.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subject } from '../core/models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = `${environment.apiUrl}/subjects`;
  
  constructor(private http: HttpClient) { }
  
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response.success && response.data) {
          // Mapper les champs du backend vers le frontend model
          return response.data.map((item: any) => ({
            _id: item._id,
            name: item.nomMatiere,  // Mapper nomMatiere -> name
            description: item.description,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Erreur dans getAllSubjects:', error);
        throw error;
      })
    );
  }
  
  getSubjectById(id: string): Observable<Subject> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          const item = response.data;
          return {
            _id: item._id,
            name: item.nomMatiere,  // Mapper nomMatiere -> name
            description: item.description,
            image: item.image,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          };
        }
        throw new Error('Matière non trouvée');
      }),
      catchError(error => {
        console.error('Erreur dans getSubjectById:', error);
        throw error;
      })
    );
  }
  
  createSubject(subjectData: any): Observable<any> {
    // Convertir du modèle frontend vers le format backend
    const backendData = {
      nomMatiere: subjectData.name,
      description: subjectData.description,
      image: subjectData.image
    };
    
    return this.http.post(this.apiUrl, backendData);
  }
  
  updateSubject(id: string, subjectData: any): Observable<any> {
    // Convertir du modèle frontend vers le format backend
    const backendData = {
      nomMatiere: subjectData.name,
      description: subjectData.description,
      image: subjectData.image
    };
    
    return this.http.put(`${this.apiUrl}/${id}`, backendData);
  }
  
  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}