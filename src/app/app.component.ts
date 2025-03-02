import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SidebarService } from './shared/services/sidebar.service';
import { Subscription } from 'rxjs';

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
  
  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Observer les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Masquer les éléments sur les pages login et register
      const currentRoute = event.urlAfterRedirects;
      this.showHeaderFooter = !(
        currentRoute.includes('/login') ||
        currentRoute.includes('/signup')
      );
      
      // Mise à jour des classes du body
      this.updateBodyClasses();
    });
    
    // S'abonner aux changements de la barre latérale
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      (expanded: boolean) => {
        // Mettre à jour les classes du body en fonction de l'état de la barre latérale
        this.updateBodyClasses(expanded);
      }
    );
  }
  
  ngOnDestroy() {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
  
  private updateBodyClasses(sidebarExpanded?: boolean) {
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
  }
}
