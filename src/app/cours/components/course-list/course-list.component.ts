import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { Course } from '../../../core/models/course.model';
import { forkJoin, of, Subscription, tap } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interface pour représenter un cours avec sa progression
interface CourseWithProgress {
  _id: string | undefined;
  id?: string | undefined; // Garder pour compatibilité existante
  title: string;
  description: string;
  progress: number;
  coursePdfUrl?: string;
  exercisePdfUrl?: string;
  qcmPdfUrl?: string;
  subject: string;
  // Autres propriétés optionnelles si nécessaire
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  isSidebarExpanded: boolean = true;
  private sidebarSubscription: Subscription | undefined;
  private dataSubscription: Subscription | undefined;
  
  // Courses with progression data
  coursesWithProgress: CourseWithProgress[] = [];
  filteredCourses: CourseWithProgress[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private sidebarService: SidebarService,
    private courseService: CourseService,
    private progressService: ProgressService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      expanded => {
        this.isSidebarExpanded = expanded;
      }
    );
    
    // Load courses and progression data
    this.loadCoursesWithProgression();
  }
  
  loadCoursesWithProgression(): void {
    this.loading = true;
    this.error = null;
    
    // Définir les cours avec les noms de fichiers spécifiés
    const defaultCourses: CourseWithProgress[] = [
      {
        _id: '1',
        id: '1',
        title: '1_Introduction aux réseaux informatiques',
        description: 'Introduction aux réseaux informatiques',
        progress: 0,
        coursePdfUrl: '/assets/pdf/1_Introduction_aux_réseaux_informatiques.pdf',
        subject: 'Réseaux'
      },
      {
        _id: '2',
        id: '2',
        title: '2_OSI_VE+',
        description: 'OSI et modèles',
        progress: 0,
        coursePdfUrl: '/assets/pdf/2_OSI_VE+.pdf',
        subject: 'Réseaux'
      },
      {
        _id: '3',
        id: '3',
        title: '3_Techniques d\'adressage d\'un réseau local',
        description: 'Techniques d\'adressage',
        progress: 0,
        coursePdfUrl: '/assets/pdf/3_Techniques_d\'adressage_d_un_réseau_local.pdf',
        subject: 'Réseaux'
      },
      {
        _id: '4',
        id: '4',
        title: '4_Service_DHCP',
        description: 'Service DHCP',
        progress: 0,
        coursePdfUrl: '/assets/pdf/4_Service_DHCP.pdf',
        subject: 'Réseaux'
      },
      {
        _id: '5',
        id: '5',
        title: '5_Service_DNS',
        description: 'Service DNS',
        progress: 0,
        coursePdfUrl: '/assets/pdf/5_Service_DNS.pdf',
        subject: 'Réseaux'
      },
      {
        _id: '6',
        id: '6',
        title: '6_services web',
        description: 'Services web',
        progress: 0,
        coursePdfUrl: '/assets/pdf/6_services_web.pdf',
        subject: 'Réseaux'
      }
    ];
    
    // Mettre à jour les données de progression depuis notre service de progression
    const coursesWithRealProgress = defaultCourses.map(course => {
      const courseId = course._id as string;
      // Récupérer la progression réelle depuis le service
      const progressPercentage = this.progressService.getProgressPercentage(courseId);
      
      return {
        ...course,
        progress: progressPercentage
      };
    });
    
    this.coursesWithProgress = coursesWithRealProgress;
    this.filteredCourses = coursesWithRealProgress;
    this.loading = false;
    
    console.log('Cours avec progression réelle:', this.coursesWithProgress);
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
