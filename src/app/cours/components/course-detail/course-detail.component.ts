// src/app/cours/components/course-detail/course-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../../core/models/course.model';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgressionService } from '../../../services/progression.service';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { Exercise } from '../../../core/models/exercise.model';
import { Progression } from '../../../core/models/progression.model';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: Course | null = null;
  exercises: Exercise[] = [];
  progression: Progression | null = null;
  loading = false;
  error: string | null = null;
  userId: string | null = null;
  
  // Navigation
  activeTab: string = 'course'; // Default tab
  isSidebarExpanded: boolean = true;
  private sidebarSubscription: Subscription | undefined;
  
  // PDF Files
  coursePdfUrl: SafeResourceUrl | null = null;
  exercisePdfUrl: SafeResourceUrl | null = null;
  qcmPdfUrl: SafeResourceUrl | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private exerciseService: ExerciseService,
    private progressionService: ProgressionService,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private sanitizer: DomSanitizer
  ) { }
  
  ngOnInit(): void {
    console.log('CourseDetailComponent: Initialisation');
    
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      expanded => {
        this.isSidebarExpanded = expanded;
      }
    );
    
    // IMPORTANT: Vérifier l'URL actuelle pour identifier les problèmes de routing
    console.log('URL actuelle:', window.location.href);
    
    // Extraire l'ID du cours directement de l'URL pour éviter les problèmes de routing
    const urlSegments = window.location.href.split('/');
    const courseIdFromUrl = urlSegments[urlSegments.length - 1];
    console.log('ID du cours extrait de l\'URL:', courseIdFromUrl);
    
    // Récupérer l'ID du cours depuis les paramètres de la route
    this.route.paramMap.subscribe(params => {
      const courseId = params.get('id');
      console.log('ID du cours depuis les paramètres de la route:', courseId);
      
      if (!courseId) {
        console.error('Aucun ID de cours trouvé dans les paramètres de la route');
        this.error = "ID de cours manquant";
        return;
      }
      
      // Vérifier que l'utilisateur est authentifié sans rediriger
      if (this.authService.isLoggedIn()) {
        const user = this.authService.currentUserValue;
        this.userId = user?._id || null;
        console.log('Utilisateur connecté avec ID:', this.userId);
        
        // Charger le cours manuellement sans utiliser les données du resolver
        this.loadCourse(courseId);
      } else {
        console.error('Utilisateur non authentifié');
        this.error = "Vous devez être connecté pour accéder aux cours";
      }
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
  
  loadCourse(id: string): void {
    this.loading = true;
    this.error = null;
    
    console.log(`Chargement du cours ID: ${id}`);
    
    this.courseService.getCourseById(id)
      .pipe(
        catchError(err => {
          this.error = 'Erreur lors du chargement du cours: ' + err.message;
          console.error('Erreur détaillée:', err);
          // Retourner un observable avec null au lieu de laisser l'erreur se propager
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          console.log('Chargement du cours terminé');
        })
      )
      .subscribe((data) => {
        if (data) {
          console.log('Cours récupéré avec succès:', data);
          this.course = data;
          
          // Configuration des URLs PDF
          this.setupPdfUrls();
          
          // Charger les exercices et la progression après avoir obtenu le cours
          if (this.course._id) {
            this.loadExercises(this.course._id);
            if (this.userId) {
              this.loadProgression(this.course._id);
            }
          }
        } else {
          console.warn('Aucune donnée de cours reçue');
          this.course = null;
        }
      });
  }
  
  // Helper method to ensure URLs are absolute
  private getAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) {
      return url; // Already absolute
    } else if (url.startsWith('/')) {
      // Relative to the root, append backend base URL
      return `${environment.apiBaseUrl}${url}`;
    } else {
      // Fully relative path, prepend with backend URL and uploads path
      return `${environment.apiBaseUrl}/uploads/${url}`;
    }
  }

  loadExercises(courseId: string): void {
    this.exerciseService.getExercisesByCourse(courseId)
      .subscribe({
        next: (data: Exercise[]) => {
          this.exercises = data;
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des exercices:', err);
        }
      });
  }
  
  loadProgression(courseId: string): void {
    if (!this.userId) return;
    
    this.progressionService.getCourseProgression(this.userId, courseId)
      .subscribe({
        next: (data: Progression) => {
          this.progression = data;
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement de la progression:', err);
        }
      });
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  // Nouvelle méthode pour configurer les URLs PDF
  private setupPdfUrls(): void {
    if (this.course) {
      if (this.course.coursePdfUrl) {
        const courseUrl = this.getAbsoluteUrl(this.course.coursePdfUrl);
        console.log('Course PDF URL:', courseUrl);
        this.coursePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(courseUrl);
      }
      if (this.course.exercisePdfUrl) {
        const exerciseUrl = this.getAbsoluteUrl(this.course.exercisePdfUrl);
        console.log('Exercise PDF URL:', exerciseUrl);
        this.exercisePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(exerciseUrl);
      }
      if (this.course.qcmPdfUrl) {
        const qcmUrl = this.getAbsoluteUrl(this.course.qcmPdfUrl);
        console.log('QCM PDF URL:', qcmUrl);
        this.qcmPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(qcmUrl);
      }
    }
  }
  
  // Update progression when user completes a chapter
  markChapterComplete(chapterId: string): void {
    if (!this.userId || !this.course || !this.course._id) return;
    
    // Si progression existe déjà, on met à jour avec son ID
    if (this.progression && this.progression._id) {
      this.progressionService.updateProgression(this.progression._id, {
        progress: 100,
        completed: true
      })
      .subscribe({
        next: (updatedProgression: Progression) => {
          this.progression = updatedProgression;
          console.log('Progression mise à jour', updatedProgression);
        },
        error: (err: any) => {
          console.error('Erreur lors de la mise à jour de la progression:', err);
        }
      });
    } else {
      // Créer une nouvelle progression
      this.progressionService.updateProgression('new', {
        user: this.userId,
        course: this.course._id,
        progress: 100,
        completed: true
      })
      .subscribe({
        next: (updatedProgression: Progression) => {
          this.progression = updatedProgression;
          console.log('Progression créée', updatedProgression);
        },
        error: (err: any) => {
          console.error('Erreur lors de la création de la progression:', err);
        }
      });
    }
  }
}