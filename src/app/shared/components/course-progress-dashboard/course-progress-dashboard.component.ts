import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressionService } from '../../../services/progression.service';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Progression } from '../../../core/models/progression.model';
import { Course } from '../../../core/models/course.model';
import { forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface CourseProgressViewModel {
  course: Course;
  progression: Progression;
}

@Component({
  selector: 'app-course-progress-dashboard',
  templateUrl: './course-progress-dashboard.component.html',
  styleUrls: ['./course-progress-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CourseProgressDashboardComponent implements OnInit {
  userId: string = '';
  courseProgressions: CourseProgressViewModel[] = [];
  completedCourses: CourseProgressViewModel[] = [];
  inProgressCourses: CourseProgressViewModel[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private progressionService: ProgressionService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initUserId();
  }

  initUserId(): void {
    this.userId = 'default_user_id';
    
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe(
        userData => {
          if (userData && userData._id) {
            this.userId = userData._id;
            this.loadUserProgressions();
          }
        },
        error => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
          this.error = 'Impossible de récupérer les données utilisateur. Veuillez vous reconnecter.';
          this.loading = false;
        }
      );
    } else {
      // Pour le développement, charger quand même les progressions avec l'ID par défaut
      this.loadUserProgressions();
    }
  }

  loadUserProgressions(): void {
    this.loading = true;
    this.error = null;
    
    this.progressionService.getUserProgressions(this.userId).pipe(
      switchMap(progressions => {
        if (progressions.length === 0) {
          this.loading = false;
          return of([]);
        }
        
        // Pour chaque progression, récupérer les détails du cours
        const courseRequests = progressions.map(prog => 
          this.courseService.getCourseById(prog.course).pipe(
            map(course => ({ course, progression: prog })),
            catchError(error => {
              console.error(`Erreur lors de la récupération du cours ${prog.course}:`, error);
              return of(null);
            })
          )
        );
        
        return forkJoin(courseRequests);
      })
    ).subscribe(
      results => {
        // Filtrer les résultats null (en cas d'erreur de récupération du cours)
        this.courseProgressions = results.filter(result => result !== null) as CourseProgressViewModel[];
        
        // Trier les cours par progression
        this.completedCourses = this.courseProgressions.filter(item => item.progression.completed);
        this.inProgressCourses = this.courseProgressions.filter(item => !item.progression.completed);
        
        // Trier par date de dernier accès (plus récent en premier)
        this.completedCourses.sort((a, b) => {
          return new Date(b.progression.lastAccessed || 0).getTime() - 
                 new Date(a.progression.lastAccessed || 0).getTime();
        });
        
        this.inProgressCourses.sort((a, b) => {
          return new Date(b.progression.lastAccessed || 0).getTime() - 
                 new Date(a.progression.lastAccessed || 0).getTime();
        });
        
        this.loading = false;
      },
      error => {
        console.error('Erreur lors de la récupération des progressions:', error);
        this.error = 'Impossible de récupérer les données de progression.';
        this.loading = false;
      }
    );
  }

  continueCourse(courseId: string): void {
    this.router.navigate(['/cours', courseId]);
  }

  navigateToFormations(): void {
    this.router.navigate(['/formations']);
  }

  getProgressClass(progress: number): string {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-info';
    if (progress >= 50) return 'bg-primary';
    if (progress >= 25) return 'bg-warning';
    return 'bg-danger';
  }
}
