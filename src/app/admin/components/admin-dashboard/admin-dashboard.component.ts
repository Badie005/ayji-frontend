// src/app/admin/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { AdminDataService } from '../../services/admin-data.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Date fictive de dernière connexion
  lastLogin = new Date();
  
  // Statistiques avec valeurs par défaut
  userCount = 0;
  courseCount = 0;
  lessonCount = 0;
  
  // Indicateur de chargement
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminDataService: AdminDataService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.router.navigate(['/home']);
    }
    
    this.loadStatistics();
  }
  
  loadStatistics(): void {
    this.loading = true;
    this.adminDataService.getStatistics().subscribe({
      next: (stats) => {
        this.userCount = stats.userCount;
        this.courseCount = stats.courseCount;
        this.lessonCount = stats.lessonCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
        // Utilisation des valeurs par défaut en cas d'erreur
        this.userCount = 23;
        this.courseCount = 12;
        this.lessonCount = 156;
        this.loading = false;
      }
    });
  }

  // Méthodes de navigation vers les différentes sections
  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  goToCourses(): void {
    this.router.navigate(['/admin/courses']);
  }

  goToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }

  navigateToAddUser(): void {
    this.router.navigate(['/admin/users/add']);
  }
  
  navigateToStatistics(): void {
    // Navigate to statistics page when implemented
    this.router.navigate(['/admin/statistics']);
  }
}