import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map, retry, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Course } from '../../core/models/course.model';

/**
 * Interface for paginated courses response
 */
export interface PaginatedCourses {
  courses: Course[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

/**
 * Interface for course search parameters
 */
export interface CourseSearchParams {
  page?: number;
  limit?: number;
  subject?: string;
  search?: string;
  sort?: string;
}

// Interface pour la réponse du backend (structure actuelle)
interface ApiCourseResponse {
  success: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: ApiCourse[];
}

// Structure de cours retournée par l'API
interface ApiCourse {
  _id?: string;
  titre: string;         // Notice: backend uses "titre" instead of "title" 
  description: string;
  idMatiere: string;     // Notice: backend uses "idMatiere" instead of "subject"
  content?: string;
  coursePdfUrl?: string;
  exercisePdfUrl?: string;
  qcmPdfUrl?: string;
  order?: number;
  dateCreation?: string;
  dateModification?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;
  private coursesCache = new Map<string, Observable<Course[]>>();
  private courseCache = new Map<string, Observable<Course>>();
  
  // Subject to hold the latest courses data
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) { 
    // L'URL devrait être simplement environment.apiUrl/courses car environment.apiUrl contient déjà '/api'
    this.apiUrl = `${environment.apiUrl}/courses`;
    console.log('URL API Courses:', this.apiUrl);
  }

  // Fonction pour convertir un cours API en cours du modèle Angular
  private mapApiCourseToModel(apiCourse: ApiCourse): Course {
    console.log('Conversion cours API:', apiCourse);
    
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
      id: apiCourse._id || '', // Assurer que l'ID n'est jamais undefined
      _id: apiCourse._id || '', // Assurer que _id n'est jamais undefined
      title: apiCourse.titre,
      description: apiCourse.description,
      subject: apiCourse.idMatiere,
      content: apiCourse.content || '',
      coursePdfUrl: formatPdfUrl(apiCourse.coursePdfUrl || ''),
      exercisePdfUrl: formatPdfUrl(apiCourse.exercisePdfUrl || ''),
      qcmPdfUrl: formatPdfUrl(apiCourse.qcmPdfUrl || ''),
      order: apiCourse.order || 0,
      createdAt: apiCourse.dateCreation ? new Date(apiCourse.dateCreation) : undefined,
      updatedAt: apiCourse.dateModification ? new Date(apiCourse.dateModification) : undefined
    };
  }

  // Récupérer tous les cours avec pagination optionnelle
  getAllCourses(page: number = 1, limit: number = 10, refresh: boolean = false): Observable<Course[]> {
    const cacheKey = `all_${page}_${limit}`;
    
    console.log(`Appel getAllCourses (page: ${page}, limit: ${limit}, refresh: ${refresh})`);
    console.log('URL de l\'API:', this.apiUrl);
    
    // Si le cache existe et que nous ne voulons pas rafraîchir, retourner le cache
    if (this.coursesCache.has(cacheKey) && !refresh) {
      console.log('Retour des cours depuis le cache');
      return this.coursesCache.get(cacheKey)!;
    }
    
    // Configurer les paramètres de pagination
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    console.log('Paramètres de requête:', params.toString());
    
    // Faire la requête et mapper la réponse au format attendu
    const request = this.http.get<ApiCourseResponse>(this.apiUrl, { params }).pipe(
      retry(1),
      map(response => {
        console.log('Réponse API cours (brute):', JSON.stringify(response));
        if (response && response.data) {
          return response.data.map(apiCourse => this.mapApiCourseToModel(apiCourse));
        } else if (Array.isArray(response)) {
          return response.map(apiCourse => this.mapApiCourseToModel(apiCourse));
        }
        return [];
      }),
      tap(courses => {
        console.log('Cours mappés:', courses);
        this.coursesSubject.next(courses);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des cours:', error);
        this.handleError(error);
        // Retourner un tableau vide en cas d'erreur pour éviter de bloquer l'application
        return of([]);
      }),
      shareReplay(1)
    );
    
    this.coursesCache.set(cacheKey, request);
    return request;
  }

  // Récupérer les cours par matière avec pagination
  getCoursesBySubject(subjectId: string, page: number = 1, limit: number = 10): Observable<Course[]> {
    const cacheKey = `subject_${subjectId}_${page}_${limit}`;
    
    if (this.coursesCache.has(cacheKey)) {
      return this.coursesCache.get(cacheKey)!;
    }
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    const request = this.http.get<ApiCourseResponse>(`${this.apiUrl}/subject/${subjectId}`, { params }).pipe(
      retry(1),
      map(response => {
        if (response && response.data) {
          return response.data.map(apiCourse => this.mapApiCourseToModel(apiCourse));
        }
        return [];
      }),
      catchError(this.handleError),
      shareReplay(1)
    );
    
    this.coursesCache.set(cacheKey, request);
    return request;
  }

  // Récupérer un cours par son ID
  getCourseById(id: string): Observable<Course> {
    console.log(`Récupération du cours avec ID: ${id}`);
    
    // Validation de base de l'ID
    if (!id || typeof id !== 'string') {
      console.error('ID de cours non valide:', id);
      return throwError(() => new Error(`ID de cours invalide: ${id}`));
    }
    
    if (this.courseCache.has(id)) {
      console.log('Cours trouvé dans le cache');
      return this.courseCache.get(id)!;
    }
    
    const request = this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      retry(1),
      map(response => {
        console.log('Réponse API pour le cours:', response);
        const apiCourse = response.data || response;
        if (!apiCourse) {
          throw new Error(`Cours avec ID ${id} non trouvé`);
        }
        return this.mapApiCourseToModel(apiCourse);
      }),
      catchError(error => {
        console.error(`Erreur lors de la récupération du cours ${id}:`, error);
        let errorMessage = `Impossible de charger le cours ${id}`;
        
        // Ajouter des détails plus spécifiques sur l'erreur
        if (error.status === 404) {
          errorMessage = `Cours avec ID ${id} non trouvé`;
        } else if (error.status === 400) {
          errorMessage = `ID de cours invalide: ${id}`;
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = `Accès non autorisé au cours ${id}`;
        } else {
          errorMessage += `: ${error.message || 'Erreur de serveur'}`;
        }
        
        // Retourner l'erreur au lieu d'utiliser handleError pour éviter la redirection
        return throwError(() => new Error(errorMessage));
      }),
      shareReplay(1)
    );
    
    this.courseCache.set(id, request);
    return request;
  }

  // Gestion générique des erreurs HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API:', error);
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Créer un nouveau cours
  createCourse(course: Course): Observable<Course> {
    return this.http.post<any>(this.apiUrl, course).pipe(
      map(response => {
        const apiCourse = response.data || response;
        return this.mapApiCourseToModel(apiCourse);
      }),
      tap(() => {
        // Vider le cache après création
        this.clearAllCaches();
      }),
      catchError(this.handleError)
    );
  }

  // Mettre à jour un cours
  updateCourse(id: string, course: Course): Observable<Course> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, course).pipe(
      map(response => {
        const apiCourse = response.data || response;
        return this.mapApiCourseToModel(apiCourse);
      }),
      tap(() => {
        // Vider le cache après mise à jour
        this.clearAllCaches();
        // Supprimer spécifiquement l'entrée du cours mis à jour
        this.courseCache.delete(id);
      }),
      catchError(this.handleError)
    );
  }

  // Supprimer un cours
  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Vider le cache après suppression
        this.clearAllCaches();
        this.courseCache.delete(id);
      }),
      catchError(this.handleError)
    );
  }
  
  // Rechercher des cours
  searchCourses(query: string): Observable<Course[]> {
    const params = new HttpParams().set('q', query);
    
    return this.http.get<ApiCourseResponse>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => {
        if (response && response.data) {
          return response.data.map(apiCourse => this.mapApiCourseToModel(apiCourse));
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  // Vider le cache pour un cours spécifique
  clearCourseCache(id: string): void {
    this.courseCache.delete(id);
  }

  // Vider tout le cache
  clearAllCaches(): void {
    this.coursesCache.clear();
    this.courseCache.clear();
  }
}
