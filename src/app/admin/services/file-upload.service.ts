// src/app/admin/services/file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = `${environment.apiUrl}/uploads`;

  constructor(private http: HttpClient) { }

  // Télécharger un fichier
  upload(file: File, type: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('type', type); // type: 'course', 'exercise', 'qcm'

    const req = new HttpRequest('POST', `${this.apiUrl}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  // Supprimer un fichier
  deleteFile(fileUrl: string): Observable<any> {
    // Extraire le nom du fichier de l'URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return new Observable(observer => observer.error('Nom de fichier invalide'));
    
    return this.http.delete(`${this.apiUrl}/${fileName}`);
  }
}
