import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models/user.model';
import { ProgressService } from '../cours/services/progress.service';
import { UserProgressService } from '../cours/services/user-progress.service';
import { CourseProgress } from '../cours/models/progress.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, DatePipe],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  currentUser: User | null = null;
  userProgressions: CourseProgress[] = [];
  courseProgressMap = new Map<string, CourseProgress>();
  globalProgress: number = 0;
  completedCourses: number = 0;
  inProgressCourses: number = 0;
  isLoading: boolean = true;
  
  // Informations supplémentaires sur l'utilisateur
  lastConnection: Date | null = null;
  totalTimeSpent: number = 0; // en secondes
  coursesTitles: {[key: string]: string} = {
    '1': 'Introduction aux réseaux',
    '2': 'Modèle OSI et TCP/IP',
    '3': 'Adressage IP',
    '4': 'Service DHCP',
    '5': 'Service DNS',
    '6': 'Services Web'
  };

  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private userProgressService: UserProgressService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('ProfilComponent initialisé');
    // Récupérer les informations de l'utilisateur courant
    this.currentUser = this.authService.currentUserValue;
    
    console.log('Utilisateur actuel:', this.currentUser);
    
    // Si aucun utilisateur n'est connecté, rediriger vers la page de connexion
    if (!this.currentUser) {
      console.log('Aucun utilisateur connecté, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }
    
    // Les administrateurs peuvent voir leur profil mais n'ont pas de progression
    if (this.currentUser.role === 'admin') {
      console.log('Utilisateur admin: ne pas charger les progressions');
      // Initialiser des valeurs par défaut pour les administrateurs
      this.globalProgress = 0;
      this.completedCourses = 0;
      this.inProgressCourses = 0;
      this.totalTimeSpent = 0;
      this.lastConnection = new Date();
      this.isLoading = false;
      return; // Ne pas charger les progressions pour l'admin
    }

    // Charger les progressions pour les utilisateurs réguliers
    this.loadUserProgressions();
  }

  loadUserProgressions(): void {
    this.isLoading = true;
    
    // Récupérer toutes les progressions disponibles
    this.userProgressions = [];
    
    // Pour chaque cours, récupérer sa progression
    for (let courseId = 1; courseId <= 6; courseId++) {
      const courseIdStr = courseId.toString();
      const progress = this.progressService.getProgress(courseIdStr);
      if (progress) {
        this.userProgressions.push(progress);
      }
    }
    
    console.log('Progressions chargées:', this.userProgressions);
    this.calculateStatistics();
    this.isLoading = false;
    
    // Tenter de synchroniser avec le serveur
    if (this.currentUser) {
      this.progressService.syncWithServer().subscribe(success => {
        if (success) {
          console.log('Synchronisation réussie avec le serveur');
          // Recharger les progressions après la synchronisation
          this.userProgressions = [];
          for (let courseId = 1; courseId <= 6; courseId++) {
            const courseIdStr = courseId.toString();
            const progress = this.progressService.getProgress(courseIdStr);
            if (progress) {
              this.userProgressions.push(progress);
            }
          }
          this.calculateStatistics();
        }
      });
    }
  }

  calculateStatistics(): void {
    if (this.userProgressions.length === 0) {
      this.globalProgress = 0;
      this.completedCourses = 0;
      this.inProgressCourses = 0;
      this.totalTimeSpent = 0;
      return;
    }

    // Calculer la progression globale (moyenne des progressions)
    const totalProgress = this.userProgressions.reduce((sum, prog) => sum + prog.completionPercentage, 0);
    this.globalProgress = Math.round(totalProgress / this.userProgressions.length);

    // Calculer le nombre de cours terminés (90% ou plus) et en cours
    this.completedCourses = this.userProgressions.filter(prog => prog.completionPercentage >= 90).length;
    this.inProgressCourses = this.userProgressions.filter(prog => prog.completionPercentage > 0 && prog.completionPercentage < 90).length;
    
    // Calculer la dernière connexion et le temps total passé
    let latestDate: Date | null = null;
    let totalTime = 0;
    
    this.userProgressions.forEach(course => {
      // Trouver la date de dernière connexion la plus récente
      const courseDate = new Date(course.lastAccessed);
      if (!latestDate || courseDate > latestDate) {
        latestDate = courseDate;
      }
      
      // Calculer le temps total passé sur les PDF
      course.modules.forEach(module => {
        module.pdfProgressList.forEach(pdf => {
          totalTime += pdf.timeSpent || 0;
        });
      });
    });
    
    this.lastConnection = latestDate;
    this.totalTimeSpent = totalTime;
    
    console.log('Statistiques calculées:', {
      globalProgress: this.globalProgress,
      completedCourses: this.completedCourses,
      inProgressCourses: this.inProgressCourses,
      lastConnection: this.lastConnection,
      totalTimeSpent: this.totalTimeSpent
    });
  }

  /**
   * Formate un temps en secondes en format lisible (HH:MM:SS ou MM:SS)
   * @param seconds Temps en secondes
   */
  formatTime(seconds: number): string {
    if (!seconds) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}min ${remainingSeconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  // Fonction de déconnexion
  logout(): void {
    // Souscrire à l'Observable pour s'assurer que la déconnexion est traitée
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  }
}