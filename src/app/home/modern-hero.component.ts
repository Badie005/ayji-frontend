import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-modern-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-part">Maîtrisez les Systèmes et Réseaux Informatiques avec nos Cours</span>
            <span class="animated-word-container">
              &nbsp;
              <span [@wordAnimation]="currentWord" class="animated-word">
                {{ words[currentWord] }}
              </span>
            </span>
          </h1>

          <p class="hero-subtitle">
            Transforme tes études en une expérience interactive et passionnante grâce à notre plateforme innovante.
          </p>
        </div>
        <div class="hero-buttons">
          <button class="btn btn-outline" (click)="startLearning()">
            Découvrir nos cours
          </button>
          <button class="btn btn-primary" (click)="requestDemo()">
            Commencer maintenant
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-container {
      width: 100%;
      padding: 40px 0;
      background-color: #f8f9fa;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .hero-text {
      text-align: center;
    }

    .hero-title {
      font-size: 2.5rem;
      line-height: 1.2;
      font-weight: 400;
      margin-bottom: 20px;
      color: #333;
    }

    .title-part {
      color: #0066cc;
    }

    .animated-word-container {
      position: relative;
      display: inline-block;
      min-width: 150px;
      height: 40px;
    }

    .animated-word {
      position: absolute;
      font-weight: 600;
      color: #0066cc;
      left: 0;
      right: 0;
      text-align: center;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      line-height: 1.5;
      color: #666;
      max-width: 600px;
      margin: 0 auto 30px;
    }

    .hero-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .btn-primary {
      background-color: #0066cc;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0052a3;
    }

    .btn-outline {
      background-color: transparent;
      color: #0066cc;
      border: 2px solid #0066cc;
    }

    .btn-outline:hover {
      background-color: rgba(0, 102, 204, 0.1);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-buttons {
        flex-direction: column;
        width: 100%;
      }

      .btn {
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('wordAnimation', [
      state('0', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('1', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition('0 => 1', [
        animate('0.5s ease-out')
      ]),
      transition('1 => 0', [
        animate('0.5s ease-out')
      ])
    ])
  ]
})
export class ModernHeroComponent implements OnInit {
  words = ['Simplifiés', 'Interactifs'];
  currentWord = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.currentWord = (this.currentWord + 1) % this.words.length;
    }, 2000);
  }

  startLearning(): void {
    this.router.navigate(['/cours']);
  }

  requestDemo(): void {
    this.router.navigate(['/about/contact']);
  }
}
