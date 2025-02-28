import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  logoSrc: string = 'logo-b-1.png';
  logoAlt: string = 'Logo AYJI';

  authButtons = [
    { text: 'Sign Up', class: 'log-sign-component-1', textClass: 'log-sign-text-1', route: '/signup' },
    { text: 'Log In', class: 'log-sign-component-2', textClass: 'log-sign-text-2', route: '/login' }
  ];
}
