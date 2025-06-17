import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero-header">
      <div class="container">
        <div class="logo-container">
          <h1 class="sr-only">AYJI</h1>
          <a href="/" class="logo">AYJI</a>
        </div>
        <nav class="main-nav">
          <ul class="nav-links">
            <li><a href="/" class="nav-link active">Accueil</a></li>
            <li><a href="/cours" class="nav-link">Cours</a></li>
            <li><a href="/about" class="nav-link">À propos</a></li>
          </ul>
        </nav>
        <div class="action-buttons">
          <button (click)="navigateTo('/connecter')" class="btn btn-secondary">Connexion</button>
          <button (click)="navigateTo('/signup')" class="btn btn-primary">S'inscrire</button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .hero-header {
      padding: 1.5rem 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-foreground);
      text-decoration: none;
    }
    
    .main-nav {
      display: flex;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      padding: 0;
      margin: 0;
    }
    
    .nav-link {
      color: var(--color-foreground);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .nav-link:hover, .nav-link.active {
      color: var(--color-primary);
    }
    
    .action-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }
    
    .btn-secondary {
      background-color: transparent;
      border: 1px solid var(--color-border);
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class HeroHeaderComponent {
  constructor(private router: Router) {}
  
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
