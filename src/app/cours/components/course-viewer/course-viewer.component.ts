import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, of, timer, interval } from 'rxjs';
import { catchError, finalize, takeWhile } from 'rxjs/operators';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Project imports
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../services/course.service';
import { ProgressService } from '../../services/progress.service';
import { ProgressService as NewProgressService } from '../../../core/services/progress.service';

// MCQ Components
import { McqViewerComponent } from '../mcq-viewer/mcq-viewer.component';
import { McqService } from '../../services/mcq.service';
import { MCQGroup } from '../../models/mcq.model';

// Course interface
interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  subject?: string;
  coursePdfUrl?: string;
  exercisePdfUrl?: string;
  solutionPdfUrl?: string;
  qcmPdfUrl?: string;
}

// Safe URL Pipe to sanitize URLs
@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string | SafeResourceUrl): SafeResourceUrl {
    if (typeof url === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return url;
  }
}

@Component({
  selector: 'app-course-viewer',
  templateUrl: './course-viewer.component.html',
  styleUrls: ['./course-viewer.component.scss', './exercise-buttons.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, SafePipe, McqViewerComponent],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CourseViewerComponent implements OnInit, OnDestroy {
  // Course data
  course: Course | null = null;
  courseId: string | null = null;
  userId: string | null = null;
  coursePdfUrl: SafeResourceUrl | null = null;
  exercisePdfUrl: SafeResourceUrl | null = null;
  solutionPdfUrl: SafeResourceUrl | null = null;
  qcmPdfUrl: SafeResourceUrl | null = null;
  
  // User progress tracking
  startTime: number = 0;
  elapsedTime: number = 0;
  totalTimeSpent: number = 0;
  progressUpdateInterval: any;
  estimatedCourseTime: number = 1800; // 30 minutes par défaut
  
  // Navigation
  previousCourseId: string | null = null;
  nextCourseId: string | null = null;
  
  // UI state
  loading = false;
  error: string | null = null;
  activeTab: 'course' | 'exercise' | 'solution' | 'qcm' = 'course';
  exerciseSubTab: 'exercises' | 'solutions' = 'exercises'; // Default sub-tab for exercises
  tabTransitioning = false;
  showBackToTop = false;
  userHasStartedCourse = false;
  progress = 0;
  progressChanged = false;
  
  // PDF state
  pdfLoading: Record<string, boolean> = {
    course: false,
    exercise: false,
    solution: false,
    qcm: false
  };
  pdfLoadError = false;
  
  // Property to track view mode to improve keyboard navigation
  viewMode: 'tabs' | 'content' = 'tabs';
  
  // Subscriptions
  private subscription = new Subscription();
  private routeSub: Subscription | null = null;
  private scrollListener: any;
  
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;
  
  // Variables for MCQs
  mcqGroups: MCQGroup[] = [];
  loadingMcqs: boolean = false;
  mcqProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private courseService: CourseService,
    private mcqService: McqService,
    private progressService: ProgressService,
    private newProgressService: NewProgressService
  ) {
    // Set default title
    this.titleService.setTitle('Cours | AYJI');
  }

  ngOnInit(): void {
    // Get user ID from auth service
    this.userId = this.authService.currentUserValue?._id || null;

    // Subscribe to route params to get course ID
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.courseId = id;
      
      if (id) {
        this.loadCourseData(id);
        this.loadMCQs(id);
        
        // Fetch user progress if user is logged in
        if (this.userId) {
          console.log(`Récupération de la progression pour l'utilisateur ${this.userId} et le cours ${id}`);
          this.fetchUserProgress(this.userId, id);
          this.startTrackingProgress();
        } else {
          console.warn('Utilisateur non connecté, impossible de récupérer la progression');
        }
      } else {
        this.error = "Identifiant de cours manquant";
      }
    });
    
    // Setup the progress tracking for PDFs
    this.setupPdfProgressTracker();
    
    // Set up scroll listener for back-to-top button
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
    
    // Set up tab keyboard navigation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.viewMode = 'tabs';
      }
    });
  }

  ngOnDestroy(): void {
    console.log('Nettoyage des ressources du composant CourseViewer');
    
    // Sauvegarder la progression avant de détruire le composant
    this.stopTrackingProgress();
    this.saveUserProgress();
    
    this.subscription.unsubscribe();
    clearInterval(this.progressUpdateInterval);
    window.removeEventListener('scroll', this.scrollListener);
  }

  loadCourseData(id: string): void {
    this.loading = true;
    this.error = null;

    this.subscription.add(
      this.courseService.getCourseById(id)
        .pipe(
          catchError(err => {
            this.error = 'Erreur lors du chargement du cours: ' + err.message;
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(course => {
          if (course) {
            this.course = course;
            this.titleService.setTitle(`${this.course.title} - Cours`);
            this.setupPdfUrls(this.course);
            this.setupCourseNavigation(id);
          } else {
            this.error = "Identifiant de cours invalide ou manquant";
          }
        })
    );
  }

  loadMCQs(courseId: string): void {
    this.loadingMcqs = true;
    
    this.subscription.add(
      this.mcqService.getMcqGroups(courseId)
        .pipe(
          finalize(() => {
            this.loadingMcqs = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (groups) => {
            this.mcqGroups = groups;
          },
          error: (error) => {
            console.error('Error loading MCQs:', error);
          }
        })
    );
  }
  
  updateMcqProgress(progress: number): void {
    this.mcqProgress = progress;
    this.updateProgress();
  }
  
  updateProgress(): void {
    // Get the course progress from the progress service
    if (!this.courseId || !this.userId) return;
    
    // Calculate new progress based on current activities
    // Get progress from legacy service first (for compatibility)
    const legacyProgress = this.progressService.getProgressPercentage(this.courseId);
    let newProgress = this.progress;
    
    // If we have legacy progress and it's higher than current progress, use it
    if (legacyProgress && legacyProgress > newProgress) {
      newProgress = legacyProgress;
    }
    
    // Calculate time-based progress (max 80% from time alone)
    const timeBasedProgress = Math.min(80, (this.totalTimeSpent / this.estimatedCourseTime) * 100);
    
    // Take the higher of current progress, legacy progress, and time-based progress
    newProgress = Math.max(newProgress, timeBasedProgress);
    
    // Only update if the progress has changed
    if (newProgress !== this.progress) {
      this.progress = newProgress;
      this.progressChanged = true;
      
      // Reset the changed flag after animation
      setTimeout(() => {
        this.progressChanged = false;
      }, 500);
      
      // Save updated progress to server
      this.saveUserProgress();
    }
    
    // Force UI update
    this.cdr.detectChanges();
  }

  setupPdfUrls(course: Course): void {
    if (!course) return;

    const urlId = this.route.snapshot.paramMap.get('id');
    if (urlId) {
      const baseUrl = '/uploads/courses/';
      const coursePdfs: Record<string, {course: string, exercise: string, solution: string, qcm: string}> = {
        '1': {
          course: baseUrl + 'cours1.pdf',
          exercise: baseUrl + 'td1.pdf',
          solution: baseUrl + 'td1_correction.pdf',
          qcm: baseUrl + 'td1_correction.pdf'
        },
        '2': {
          course: baseUrl + 'cours2.pdf',
          exercise: baseUrl + 'td2.pdf',
          solution: baseUrl + 'td2_correction.pdf',
          qcm: baseUrl + 'td2_correction.pdf'
        },
        '3': {
          course: baseUrl + 'cours3.pdf',
          exercise: baseUrl + 'td3.pdf',
          solution: baseUrl + 'td3_correction.pdf',
          qcm: baseUrl + 'td3_correction.pdf'
        },
        '4': {
          course: baseUrl + 'cours4.pdf',
          exercise: baseUrl + 'td1.pdf',
          solution: baseUrl + 'td1_correction.pdf',
          qcm: baseUrl + 'td1_correction.pdf'
        },
        '5': {
          course: baseUrl + 'cours5.pdf',
          exercise: baseUrl + 'td2.pdf',
          solution: baseUrl + 'td2_correction.pdf',
          qcm: baseUrl + 'td2_correction.pdf'
        },
        '6': {
          course: baseUrl + 'cours6.pdf',
          exercise: baseUrl + 'td3.pdf',
          solution: baseUrl + 'td3_correction.pdf',
          qcm: baseUrl + 'td3_correction.pdf'
        }
      };

      if (urlId in coursePdfs) {
        course.coursePdfUrl = coursePdfs[urlId].course;
        course.exercisePdfUrl = coursePdfs[urlId].exercise;
        course.solutionPdfUrl = coursePdfs[urlId].solution;
        course.qcmPdfUrl = coursePdfs[urlId].qcm;
      } else {
        console.warn(`Cours ${urlId}: aucun PDF trouvÃ© pour cet ID`);
      }
    }

    this.pdfLoading = {
      course: true,
      exercise: true,
      solution: true,
      qcm: true
    };

    this.coursePdfUrl = this.preparePdfForDisplay(course['coursePdfUrl']);
    this.exercisePdfUrl = this.preparePdfForDisplay(course['exercisePdfUrl']);
    this.solutionPdfUrl = this.preparePdfForDisplay(course['solutionPdfUrl']);
    this.qcmPdfUrl = this.preparePdfForDisplay(course['qcmPdfUrl']);

    setTimeout(() => {
      this.pdfLoading = {
        course: false,
        exercise: false,
        solution: false,
        qcm: false
      };
      this.cdr.detectChanges();
    }, 500);
  }

  setupCourseNavigation(currentId: string): void {
    const courseSequence = ['1', '2', '3', '4', '5', '6'];
    const currentIndex = courseSequence.indexOf(currentId);

    if (currentIndex !== -1) {
      this.previousCourseId = currentIndex > 0 ? courseSequence[currentIndex - 1] : null;
      this.nextCourseId = currentIndex < courseSequence.length - 1 ? courseSequence[currentIndex + 1] : null;
    } else {
      this.previousCourseId = null;
      this.nextCourseId = null;
    }
  }

  setActiveTab(tab: 'course' | 'exercise' | 'solution' | 'qcm'): void {
    if (this.activeTab === tab) return;

    this.tabTransitioning = true;
    this.activeTab = tab;

    // Pre-load content for the selected tab if needed
    if (tab === 'qcm' && this.courseId && this.mcqGroups.length === 0 && !this.loadingMcqs) {
      this.loadMCQs(this.courseId);
    }
    
    // Enregistrer la consultation du PDF selon le type sélectionné
    if (this.courseId) {
      this.recordPdfView(tab);
    }

    this.updateProgress();
    this.scrollToTop();

    // End transition state after a short delay
    setTimeout(() => {
      this.tabTransitioning = false;
      this.cdr.detectChanges();
    }, 300);
  }

  setExerciseSubTab(subTab: 'exercises' | 'solutions'): void {
    if (this.exerciseSubTab === subTab) return;
    this.exerciseSubTab = subTab;
    
    // Enregistrer la consultation du type de PDF sélectionné (exercice ou correction)
    if (this.courseId) {
      const pdfType = subTab === 'exercises' ? 'exercise' : 'solution';
      this.recordPdfView(pdfType);
    }
    
    this.cdr.detectChanges();
  }

  preparePdfForDisplay(url: string | undefined | null): SafeResourceUrl | null {
    if (!url) return null;

    try {
      const encodedUrl = this.encodePdfUrl(url);
      return this.sanitizer.bypassSecurityTrustResourceUrl(encodedUrl);
    } catch (error) {
      console.error('Error preparing PDF URL:', error);
      return null;
    }
  }

  encodePdfUrl(url: string | null): string {
    if (!url) return '';

    try {
      const parts = url.split('/');
      const basePath = parts.slice(0, parts.length - 1).join('/');
      const filename = parts[parts.length - 1];
      const encodedFilename = encodeURIComponent(filename);
      const finalUrl = `${basePath}/${encodedFilename}`;
      return finalUrl;
    } catch (error) {
      console.error('Error encoding PDF URL:', error);
      return url; // Return original URL if encoding fails
    }
  }

  downloadPdf(type: 'course' | 'exercise' | 'solution' | 'qcm'): void {
    if (!this.course) return;

    const courseTitle = this.course.title.replace(/\s+/g, '_');
    let pdfUrl: string | undefined = undefined;
    let fileName: string;

    switch (type) {
      case 'course':
        pdfUrl = this.course.coursePdfUrl;
        fileName = `${courseTitle}_cours.pdf`;
        break;
      case 'exercise':
        pdfUrl = this.course.exercisePdfUrl;
        fileName = `${courseTitle}_exercices.pdf`;
        break;
      case 'solution':
        pdfUrl = this.course.solutionPdfUrl;
        fileName = `${courseTitle}_corrections.pdf`;
        break;
      default:
        pdfUrl = this.course.qcmPdfUrl;
        fileName = `${courseTitle}_document.pdf`;
        break;
    }

    if (!pdfUrl) {
      console.error('PDF URL not found for download');
      return;
    }

    const encodedUrl = this.encodePdfUrl(pdfUrl);
    const a = document.createElement('a');
    a.href = encodedUrl;
    a.target = '_blank';
    a.download = fileName;
    a.setAttribute('aria-label', `TÃ©lÃ©charger ${fileName}`);
    a.click();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onScroll(): void {
    this.showBackToTop = window.scrollY > 300;
    this.cdr.detectChanges();
  }

  navigateToCoursList(): void {
    this.router.navigate(['/cours']);
  }
  
  navigateToPreviousCourse(): void {
    if (this.previousCourseId) {
      this.router.navigate(['/cours', 'viewer', this.previousCourseId]);
    }
  }
  
  /**
   * Enregistre la consultation d'un PDF selon le type sélectionné
   * @param type Type de PDF consulté (cours, exercice, correction, qcm)
   */
  recordPdfView(type: 'course' | 'exercise' | 'solution' | 'qcm'): void {
    if (!this.courseId || !this.course || !this.userId) return;
    
    // Mapper le type d'onglet au type de document pour le service de progression
    const documentType: 'cours' | 'exercice' | 'correction' = 
      type === 'course' ? 'cours' : 
      type === 'exercise' ? 'exercice' : 
      type === 'solution' ? 'correction' : 'cours';
    
    // Ne pas enregistrer les QCM comme PDF
    if (type === 'qcm') return;
    
    // Déterminer l'URL et l'ID du document en fonction du type
    let documentId: string;
    let pdfUrl: string | undefined;
    let totalPages = 10; // Valeur par défaut
    let estimatedReadTime = 600; // Valeur par défaut (10 minutes)
    
    switch(type) {
      case 'course':
        documentId = `${this.courseId}-cours`;
        pdfUrl = this.course.coursePdfUrl;
        totalPages = 15; // Estimation pour un cours
        estimatedReadTime = 900; // 15 minutes
        this.estimatedCourseTime = 1800; // 30 minutes pour le cours
        break;
      case 'exercise':
        documentId = `${this.courseId}-exercice`;
        pdfUrl = this.course.exercisePdfUrl;
        totalPages = 5; // Estimation pour un exercice
        estimatedReadTime = 600; // 10 minutes
        break;
      case 'solution':
        documentId = `${this.courseId}-correction`;
        pdfUrl = this.course.solutionPdfUrl;
        totalPages = 5; // Estimation pour une correction
        estimatedReadTime = 300; // 5 minutes
        break;
      default:
        return; // Ne rien faire si le type n'est pas reconnu
    }
    
    if (!pdfUrl) return;
    
    // Enregistrer l'ouverture du PDF dans le service de progression
    this.progressService.recordPDFOpening(
      this.courseId,
      documentId,
      documentType,
      totalPages,
      estimatedReadTime
    );
    
    // Marquer que l'utilisateur a commencé le cours
    if (!this.userHasStartedCourse) {
      this.userHasStartedCourse = true;
      this.startTrackingProgress(); // Commencer à suivre le temps passé
    }
    
    // Mettre à jour la progression du cours
    this.updateProgress();
  }
  
  /**
   * Configure un timer pour enregistrer régulièrement la progression de lecture
   */
  setupPdfProgressTracker(): void {
    // Enregistrer la position toutes les 30 secondes
    const trackingInterval = setInterval(() => {
      if (!this.courseId || !this.course || this.activeTab === 'qcm') return;
      
      // Déterminer le type de document actif
      let documentType: 'cours' | 'exercice' | 'correction';
      let documentId: string;
      let totalPages: number;
      
      if (this.activeTab === 'course') {
        documentType = 'cours';
        documentId = `${this.courseId}-cours`;
        totalPages = 15;
      } else if (this.activeTab === 'exercise' && this.exerciseSubTab === 'exercises') {
        documentType = 'exercice';
        documentId = `${this.courseId}-exercice`;
        totalPages = 5;
      } else if (this.activeTab === 'solution' || 
               (this.activeTab === 'exercise' && this.exerciseSubTab === 'solutions')) {
        documentType = 'correction';
        documentId = `${this.courseId}-correction`;
        totalPages = 5;
      } else {
        return;
      }
      
      // Simuler une progression de page (dans un vrai cas, on récupérerait la page actuelle du PDF)
      let currentPage = Math.floor(Math.random() * totalPages);
      
      // Enregistrer la consultation de la page actuelle et du temps passé
      this.progressService.recordPDFPageView(
        this.courseId,
        documentId,
        currentPage,
        30 // 30 secondes par intervalle
      );
      
      // Mettre à jour l'affichage de la progression
      this.updateProgress();
      
      // Sauvegarder la progression toutes les 30 secondes
      this.saveUserProgress();
      
    }, 30000); // Toutes les 30 secondes
    
    // Nettoyer l'intervalle quand le composant est détruit
    this.subscription.add({
      unsubscribe: () => {
        clearInterval(trackingInterval);
      }
    });
  }
  
  // Méthodes pour le nouveau système de suivi de progression
  
  /**
   * Récupère la progression de l'utilisateur pour le cours actuel
   */
  fetchUserProgress(userId: string, courseId: string): void {
    this.newProgressService.getUserCourseProgress(userId, courseId)
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            console.log('Progression récupérée du serveur:', response.data);
            
            // Mettre à jour les données de progression
            this.progress = response.data.pourcentage || 0;
            this.totalTimeSpent = response.data.tempsTotal || 0;
            
            // Mettre à jour l'interface utilisateur
            this.userHasStartedCourse = response.data.statut !== 'Non commencé';
            this.cdr.detectChanges();
          } else if (response && response.success && !response.data) {
            console.log('Aucune progression existante pour ce cours, initialisation à 0%');
            // Initialiser une nouvelle progression
            this.progress = 0;
            this.totalTimeSpent = 0;
            this.userHasStartedCourse = false;
            
            // Créer une progression initiale
            this.saveUserProgress();
          } else {
            console.warn('Réponse inattendue lors de la récupération de la progression:', response);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de la progression:', error);
          // En cas d'erreur, initialiser à 0 et essayer de créer une nouvelle progression
          this.progress = 0;
          this.totalTimeSpent = 0;
          this.saveUserProgress();
        }
      });
  }
  
  /**
   * Démarre le suivi du temps passé sur le cours
   */
  startTrackingProgress(): void {
    if (this.progressUpdateInterval) {
      // Éviter de créer plusieurs intervalles
      clearInterval(this.progressUpdateInterval);
    }
    
    console.log('Démarrage du suivi de progression');
    this.startTime = Date.now();
    
    // Mettre à jour le temps passé toutes les 10 secondes
    this.progressUpdateInterval = setInterval(() => {
      const currentTime = Date.now();
      const sessionTime = Math.floor((currentTime - this.startTime) / 1000);
      this.elapsedTime = sessionTime;
      this.totalTimeSpent += 10; // Ajouter 10 secondes
      
      // Mettre à jour la progression basée sur le temps
      this.updateProgress();
      
      // Sauvegarder la progression toutes les 30 secondes
      if (sessionTime % 30 === 0) {
        this.saveUserProgress();
      }
    }, 10000);
  }
  
  /**
   * Arrête le suivi du temps passé sur le cours
   */
  stopTrackingProgress(): void {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      
      // Calculer le temps total passé dans cette session
      const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.totalTimeSpent += sessionTime;
    }
  }
  
  /**
   * Sauvegarde la progression de l'utilisateur
   */
  saveUserProgress(): void {
    if (!this.userId || !this.courseId) return;
    
    // Déterminer le statut de progression
    const status = this.newProgressService.determineStatus(this.progress);
    
    console.log(`Sauvegarde de la progression: ${this.progress}% pour l'utilisateur ${this.userId} sur le cours ${this.courseId}`);
    
    const progressData = {
      statut: status,
      pourcentage: Math.round(this.progress), // Arrondir pour éviter les valeurs décimales
      tempsTotal: this.totalTimeSpent
    };
    
    // Sauvegarder localement d'abord (en cas de perte de connexion)
    this.saveProgressLocally(progressData);
    
    // Sauvegarder la progression avec le nouveau service
    this.newProgressService.updateUserCourseProgress(this.userId, this.courseId, progressData)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            console.log('Progression sauvegardée avec succès:', response.data);
            // Supprimer la sauvegarde locale car elle a été enregistrée avec succès
            this.clearLocalProgress();
          } else {
            console.warn('Réponse de sauvegarde inattendue:', response);
          }
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde de la progression:', error);
          // Conserver la sauvegarde locale en cas d'erreur
        }
      });
  }
  
  /**
   * Sauvegarde la progression en local (localStorage) en cas d'échec du serveur
   */
  private saveProgressLocally(progressData: any): void {
    if (!this.userId || !this.courseId) return;
    
    try {
      const key = `progress_${this.userId}_${this.courseId}`;
      const data = {
        ...progressData,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(data));
      console.log('Progression sauvegardée localement comme sécurité');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale:', error);
    }
  }
  
  /**
   * Supprime la sauvegarde locale une fois que la progression a été enregistrée avec succès
   */
  private clearLocalProgress(): void {
    if (!this.userId || !this.courseId) return;
    
    try {
      const key = `progress_${this.userId}_${this.courseId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression de la sauvegarde locale:', error);
    }
  }
  
  /**
   * Tente de récupérer et d'envoyer les progressions locales non synchronisées
   * Appelé au démarrage du composant
   */
  private syncLocalProgressions(): void {
    if (!this.userId) return;
    
    try {
      // Chercher toutes les progressions locales pour cet utilisateur
      const keys = Object.keys(localStorage).filter(key => key.startsWith(`progress_${this.userId}_`));
      
      if (keys.length === 0) return;
      
      console.log(`${keys.length} progression(s) locale(s) à synchroniser`);
      
      // Tenter de synchroniser chaque progression locale
      keys.forEach(key => {
        try {
          const storedData = localStorage.getItem(key);
          if (!storedData) return;
          
          const data = JSON.parse(storedData);
          const parts = key.split('_');
          if (parts.length < 3) return; // Vérifier que le format est correct
          
          const courseId = parts[2]; // Format: progress_userId_courseId
          
          if (!courseId || !data.pourcentage) return;
          
          // Si la progression date de plus de 7 jours, la supprimer
          const timestamp = data.timestamp || 0;
          const now = Date.now();
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
          
          if (now - timestamp > maxAge) {
            localStorage.removeItem(key);
            return;
          }
          
          // S'assurer que userId et courseId sont non nuls
          if (!this.userId || !courseId) return;
          
          // Envoyer la progression au serveur
          this.newProgressService.updateUserCourseProgress(this.userId, courseId, {
            statut: data.statut,
            pourcentage: data.pourcentage,
            tempsTotal: data.tempsTotal
          }).subscribe({
            next: () => {
              console.log(`Progression locale synchronisée avec succès pour le cours ${courseId}`);
              localStorage.removeItem(key);
            },
            error: () => console.error(`Échec de la synchronisation pour le cours ${courseId}`)
          });
        } catch (error) {
          console.error('Erreur lors de la synchronisation d\'une progression:', error);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la synchronisation des progressions locales:', error);
    }
  }
  navigateToNextCourse(): void {
    // Sauvegarder la progression avant de naviguer
    this.saveUserProgress();
    
    if (this.nextCourseId) {
      this.router.navigate(['/cours', 'viewer', this.nextCourseId]);
    }
  }
}
