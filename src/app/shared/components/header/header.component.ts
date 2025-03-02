import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logoSrc: string = 'logo-b-1.png';
  logoAlt: string = 'Logo AYJI';

  authButtons = [
    { text: 'Sign Up', class: 'log-sign-component-1', textClass: 'log-sign-text-1', route: '/signup' },
    { text: 'Log In', class: 'log-sign-component-2', textClass: 'log-sign-text-2', route: '/login' }
  ];

  // Sidebar state
  isSidebarExpanded = true;
  
  constructor(private sidebarService: SidebarService) {}
  
  // Toggle the sidebar state
  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
  
  // Initialize sidebar state from service
  ngOnInit() {
    this.sidebarService.sidebarState$.subscribe(expanded => {
      this.isSidebarExpanded = expanded;
    });
  }
}
