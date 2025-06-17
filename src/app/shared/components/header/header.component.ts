import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoSrc: string = 'logo-b-1.png';
  logoAlt: string = 'Logo AYJI';

  authButtons = [
    { text: 'Sign Up', class: 'log-sign-component-1', textClass: 'log-sign-text-1', route: '/signup' },
    { text: 'Log In', class: 'log-sign-component-2', textClass: 'log-sign-text-2', route: '/login' }
  ];

  // Menus selon le rôle
  adminMenuItems = [
    { text: 'Dashboard', route: '/admin/dashboard' },
    { text: 'Gérer les utilisateurs', route: '/admin/users' },
    { text: 'Paramètres', route: '/admin/settings' }
  ];

  studentMenuItems = [
    { text: 'Mes cours', route: '/member/courses' },
    { text: 'Mon profil', route: '/profil' }
  ];
  
  // Sidebar state
  isSidebarExpanded = true;
  
  // Etat d'authentification
  currentUser: User | null = null;
  private authSubscription: Subscription | undefined; 
  
  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  // Toggle the sidebar state
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  
  // Fonction de déconnexion
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Redirection vers la page d'accueil ou de connexion après déconnexion
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, rediriger quand même vers la page de connexion
        this.router.navigate(['/login']);
      }
    });
  }
  
  // Vérifier si l'utilisateur est un administrateur
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
  
  // Vérifier si l'utilisateur est un étudiant
  isStudent(): boolean {
    return this.currentUser?.role === 'etudiant';
  }
  
  // Initialize sidebar state from service and auth state
  ngOnInit() {
    // S'abonner à l'état de la barre latérale
    this.sidebarService.sidebarState$.subscribe(expanded => {
      this.isSidebarExpanded = expanded;
    });
    
    // S'abonner à l'état d'authentification
    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy() {
    // Désabonnement pour éviter les fuites de mémoire
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Nouvelle méthode pour naviguer vers le dashboard admin
  navigateToAdminDashboard() {
    this.adminMenuItems[0].route = '/admin/dashboard';
  }

  // Nouvelle méthode pour naviguer vers la gestion des utilisateurs
  navigateToAdminUsers() {
    this.adminMenuItems[1].route = '/admin/users';
  }

  // Nouvelle méthode pour naviguer vers les paramètres admin
  navigateToAdminSettings() {
    this.adminMenuItems[2].route = '/admin/settings';
  }
}
