import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit, OnDestroy {
  menuItems = [
    { text: 'Accueil', route: '/home' }, // Changez '/accueil' en '/home'
    { text: 'About', route: '/about' },  // Cette route n'existe pas encore dans app.routes.ts
    { text: 'Connecter', route: '/connecter' }, // Cette route n'existe pas encore dans app.routes.ts
    { text: 'Cours', route: '/cours' }  // Cette route n'existe pas encore dans app.routes.ts
  ];
  
  // Default sidebar state is expanded
  isSidebarExpanded = true;
  private sidebarSubscription: Subscription | undefined;
  
  constructor(private sidebarService: SidebarService) {}
  
  ngOnInit() {
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      (expanded: boolean) => {
        this.isSidebarExpanded = expanded;
      }
    );
    
    // Initialize from saved state
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      const isExpanded = savedState === 'true';
      this.isSidebarExpanded = isExpanded;
      // Update service without triggering another localStorage save
      this.sidebarService.setSidebarStateWithoutSaving(isExpanded);
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
  
  ngOnDestroy() {
    // Clean up subscription
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}
