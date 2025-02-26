import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  logoSrc: string = 'logo-b-1.png';
  currentYear: number = new Date().getFullYear();

  footerSections = [
    {
      title: 'Ressources',
      items: [
        { name: 'Documentation complète', link: '/documentation' },
        { name: 'Tutoriels vidéo et supports écrits', link: '/tutoriels' },
        { name: 'Exercices corrigés et études de cas', link: '/exercices' },
        { name: 'Quiz interactifs', link: '/quiz' },
        { name: 'Glossaire des termes techniques', link: '/glossaire' }
      ]
    },
    {
      title: 'Formations disponibles',
      items: [
        { name: 'Systèmes et Réseaux Informatiques (SRI)', link: '/formations/sri' },
        { name: 'Cours interactifs pour BTS MaCW', link: '/formations/bts-macw' },
        { name: 'Exercices pratiques et corrigés', link: '/formations/exercices' },
        { name: 'Quizz pour évaluer vos compétences', link: '/formations/quiz' },
        { name: 'Ressources pédagogiques téléchargeables', link: '/formations/ressources' }
      ]
    },
    {
      title: 'À propos AYJI',
      items: [
        { name: 'Notre mission', link: '/a-propos/mission' },
        { name: 'L\'équipe derrière AYJI', link: '/a-propos/equipe' },
        { name: 'Nos valeurs', link: '/a-propos/valeurs' },
        { name: 'Contactez-nous', link: '/contact' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { name: 'Conditions générales d\'utilisation', link: '/legal/cgu' },
        { name: 'Politique de confidentialité', link: '/legal/privacy-policy' },
        { name: 'Mentions légales', link: '/legal/mentions-legales' }
      ]
    }
  ];

  socialLinks = [
    {
      name: 'GitHub',
      icon: 'github.svg',
      link: 'https://github.com/ayji',
      ariaLabel: 'Visitez notre GitHub'
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin.svg',
      link: 'https://linkedin.com/company/ayji',
      ariaLabel: 'Suivez-nous sur LinkedIn'
    },
    {
      name: 'Stack Overflow',
      icon: 'stackoverflow.svg',
      link: 'https://stackoverflow.com/users/ayji',
      ariaLabel: 'Rejoignez-nous sur Stack Overflow'
    }
  ];
}
