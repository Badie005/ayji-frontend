import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SidebarService } from './shared/services/sidebar.service';
import { Subscription } from 'rxjs';
import { AuthService, User } from './core/services/auth.service';

@Component({
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    CommonModule
  ],
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  showHeaderFooter = true;
  private sidebarSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;
  
  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Observer les changements d'authentification
    this.authSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      console.log('État d\'authentification changé:', user);
      this.updateHeaderFooterVisibility(user);
    });
    
    // Observer les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Masquer les éléments sur les pages login et register
      const currentRoute = event.urlAfterRedirects;
      console.log('Navigation vers:', currentRoute);
      
      this.updateHeaderFooterVisibilityByRoute(currentRoute);
      
      // Mise à jour des classes du body
      this.updateBodyClasses();
    });
    
    // Vérifier l'état initial d'authentification
    const currentUser = this.authService.currentUserValue;
    this.updateHeaderFooterVisibility(currentUser);
    
    // Mettre à jour les classes du body initialement
    this.updateBodyClasses();
    
    // S'abonner aux changements de la barre latérale
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      (expanded: boolean) => {
        // Mettre à jour les classes du body en fonction de l'état de la barre latérale
        this.updateBodyClasses(expanded);
      }
    );
  }
  
  // Nouvelle méthode pour mettre à jour la visibilité en fonction de l'utilisateur
  private updateHeaderFooterVisibility(user: User | null): void {
    if (!user) {
      // Si pas d'utilisateur, vérifier si on est sur une page de login/signup
      const currentUrl = this.router.url;
      this.updateHeaderFooterVisibilityByRoute(currentUrl);
    } else {
      // Si utilisateur connecté, toujours afficher header/footer sauf routes spéciales
      this.updateHeaderFooterVisibilityByRoute(this.router.url, true);
    }
  }
  
  // Méthode mise à jour pour gérer la visibilité par route
  private updateHeaderFooterVisibilityByRoute(route: string, isAuthenticated: boolean = false): void {
    // Les routes où header/footer sont toujours cachés
    const hideHeaderFooterRoutes = ['/login', '/signup', '/register'];
    
    // Si l'utilisateur est authentifié, montrer header/footer sauf pour les routes spécifiques
    if (isAuthenticated) {
      this.showHeaderFooter = !hideHeaderFooterRoutes.some(r => route.includes(r));
    } else {
      // Si non authentifié, montrer header/footer sur les routes publiques (home, about, etc.)
      const publicRoutes = ['/', '/home', '/about', '/a-propos', '/legal', '/mentions-legales', '/conditions-generales', '/politique-de-confidentialite', '/cours'];
      this.showHeaderFooter = publicRoutes.some(r => route === r || route.startsWith(r + '/'));
    }
    
    console.log(`Route: ${route}, Authentifié: ${isAuthenticated}, Afficher header/footer: ${this.showHeaderFooter}`);
  }
  
  private updateBodyClasses(sidebarExpanded?: boolean): void {
    // Si nous sommes sur login/signup, pas de sidebar du tout
    if (!this.showHeaderFooter) {
      this.renderer.removeClass(document.body, 'sidebar-expanded');
      this.renderer.removeClass(document.body, 'sidebar-collapsed');
      this.renderer.addClass(document.body, 'sidebar-hidden');
      return;
    }
    
    // Si nous avons un état explicite passé en paramètre
    if (sidebarExpanded !== undefined) {
      if (sidebarExpanded) {
        this.renderer.addClass(document.body, 'sidebar-expanded');
        this.renderer.removeClass(document.body, 'sidebar-collapsed');
      } else {
        this.renderer.removeClass(document.body, 'sidebar-expanded');
        this.renderer.addClass(document.body, 'sidebar-collapsed');
      }
      this.renderer.removeClass(document.body, 'sidebar-hidden');
    }
    
    // Ajouter/supprimer des classes au body selon l'état du header/footer
    if (this.showHeaderFooter) {
      this.renderer.addClass(document.body, 'has-header-footer');
      this.renderer.removeClass(document.body, 'no-header-footer');
    } else {
      this.renderer.removeClass(document.body, 'has-header-footer');
      this.renderer.addClass(document.body, 'no-header-footer');
    }
  }

  ngOnDestroy() {
    // Nettoyer les abonnements pour éviter les fuites de mémoire
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
    
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
