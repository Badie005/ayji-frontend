import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressService } from '../../../core/services/progress.service';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../cours/services/course.service';
import { FormatTimePipe } from '../../pipes/format-time.pipe';
import { StatusClassPipe } from '../../pipes/status-class.pipe';

interface UserProgress {
  courseId: string;
  courseName: string;
  progress: number;
  status: string;
  lastAccessed?: Date;
  timeSpent: number; // en secondes
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatTimePipe, StatusClassPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  userName: string = '';
  userEmail: string = '';
  userProgress: UserProgress[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private courseService: CourseService
  ) {}
  
  ngOnInit(): void {
    // Obtenir l'ID utilisateur depuis le service d'authentification
    // Adapter selon la méthode réellement disponible dans votre service
    this.authService.getCurrentUser().subscribe((user: any) => {
      if (user && user._id) {
        this.userId = user._id; // Utilisation de _id comme identifiant MongoDB standard
        this.loadUserData();
        this.loadUserProgress();
      }
    });
  }
  
  loadUserData(): void {
    if (!this.userId) return;
    
    // Adapter selon la méthode réellement disponible dans votre service
    this.authService.getCurrentUser().subscribe({
      next: (userData: any) => {
        if (userData) {
          this.userName = userData.name || userData.username || 'Utilisateur';
          this.userEmail = userData.email || '';
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des données utilisateur', error);
        this.error = 'Impossible de charger vos informations. Veuillez réessayer plus tard.';
      }
    });
  }
  
  loadUserProgress(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.error = null;
    
    this.progressService.getUserProgress(this.userId).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          // Transformer les données de progression
          this.processProgressData(response.data);
        } else {
          this.error = 'Aucune donnée de progression disponible';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des progressions', error);
        this.error = 'Impossible de charger vos progressions. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }
  
  processProgressData(progressData: any[]): void {
    if (!progressData || progressData.length === 0) {
      this.userProgress = [];
      return;
    }
    
    // On récupère les informations des cours pour les associer aux progressions
    const courseIds = progressData.map(p => p.idCours);
    
    // Charge les détails des cours (si nécessaire, sinon on peut utiliser les données fournies)
    this.userProgress = progressData.map(item => {
      return {
        courseId: item.idCours,
        courseName: item.courseName || 'Cours ' + item.idCours,
        progress: item.pourcentage || 0,
        status: item.statut || 'Non commencé',
        lastAccessed: item.dernierAcces ? new Date(item.dernierAcces) : undefined,
        timeSpent: item.tempsTotal || 0
      };
    });
    
    // Trier les cours par progression (décroissante)
    this.userProgress.sort((a, b) => b.progress - a.progress);
  }
  
  formatTime(seconds: number): string {
    if (!seconds) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes} min`;
    }
  }
  
  getProgressColor(progress: number): string {
    if (progress < 30) return 'progress-low';
    if (progress < 70) return 'progress-medium';
    return 'progress-high';
  }
}
