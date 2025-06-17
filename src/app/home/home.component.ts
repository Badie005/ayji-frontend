// home.component.ts amélioré
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { SidebarService } from '../shared/services/sidebar.service';
import { Subscription } from 'rxjs';
import { KaleidoscopeComponent } from '../shared/components/ui/kaleidoscope/kaleidoscope.component';
import { RibbonComponent } from '../shared/components/ui/ribbon/ribbon.component';

interface ExpertiseFeature {
  title: string;
  description: string;
}

interface ExpertiseCard {
  mainTitle: string;
  mainDescription: string;
  features: ExpertiseFeature[];
}

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  class: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, KaleidoscopeComponent, RibbonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition(':enter', [
        animate('500ms 300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('featureAnimation', [
      state('void', style({ opacity: 0, transform: 'translateX(-15px)' })),
      transition(':enter', [
        animate('400ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('heroTitle', [
      state('void', style({ opacity: 0, transform: 'translateY(-30px)' })),
      transition(':enter', [
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('heroSubtitle', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('800ms 400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('heroButton', [
      state('void', style({ opacity: 0, transform: 'scale(0.85)' })),
      transition(':enter', [
        animate('600ms 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
               style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      state('hover', style({ transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' })),
      state('normal', style({ transform: 'scale(1)', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' })),
      transition('normal <=> hover', animate('200ms ease-in-out'))
    ]),
    trigger('featureListAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('featureHover', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })),
      state('hovered', style({
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      })),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out'))
    ]),
    trigger('expertiseCardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(200, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('expertiseCardHover', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })),
      state('hovered', style({
        transform: 'scale(1.02)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      })),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out'))
    ]),
    trigger('featureItemAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        animate('0.5s ease-out')
      ])
    ]),
    trigger('featureItemHover', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })),
      state('hovered', style({
        transform: 'scale(1.02)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
      })),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out'))
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Propriété pour suivre l'onglet actif dans la section "Pourquoi Choisir Notre Plateforme ?"
  activeFeatureTab = 0;
  mainTitle = 'Maîtrisez les Systèmes et Réseaux Informatiques avec nos Cours Simplifiés.';
  subTitle = 'Transforme tes études en une expérience interactive et passionnante grâce à notre plateforme innovante.';
  
  // Variables pour la gestion de la sidebar
  isSidebarExpanded = true;
  private sidebarSubscription: Subscription | undefined;
  
  // Cartes d'expertise
  expertiseCards: ExpertiseCard[] = [
    {
      mainTitle: 'Notre Expertise en SRI',
      mainDescription: 'Une formation experte des systèmes réseaux, du fondamental à l\'avancé, pour une maîtrise complète.',
      features: [
        {
          title: 'Fondamentaux des Réseaux',
          description: 'Maîtrisez les concepts essentiels des Systèmes et Réseaux Informatiques à travers des contenus pédagogiques structurés. Nos ressources sont conçues pour rendre l\'apprentissage du SRI accessible à tous les niveaux, des débutants aux plus avancés.'
        },
        {
          title: 'Concepts Avancés du SRI',
          description: 'Approfondissez vos connaissances avec des modules spécialisés couvrant les aspects complexes des réseaux informatiques. Ces contenus sont particulièrement adaptés aux étudiants cherchant à exceller dans leur cursus.'
        },
        {
          title: 'Apprentissage Personnalisé',
          description: 'Notre plateforme s\'adapte à votre rythme d\'apprentissage, que vous soyez en formation initiale ou en perfectionnement, avec un accès flexible aux ressources selon vos besoins.'
        }
      ]
    },
    {
      mainTitle: 'Parcours d\'Apprentissage',
      mainDescription: 'Un apprentissage interactif et organisé qui allie théorie, pratique et soutien personnalisé pour réussir.',
      features: [
        {
          title: 'Progression Structurée',
          description: 'Suivez un programme pédagogique organisé par niveaux, combinant théorie et pratique pour une compréhension approfondie des systèmes et réseaux informatiques.'
        },
        {
          title: 'Exercices Pratiques',
          description: 'Renforcez vos compétences grâce à des exercices corrigés, des quiz interactifs et des cas pratiques inspirés de situations réelles en SRI.'
        },
        {
          title: 'Accompagnement Interactif',
          description: 'Bénéficiez d\'un support personnalisé via nos chats en direct et nos sessions de cours live avec des enseignants expérimentés.'
        }
      ]
    },
    {
      mainTitle: 'Domaines Couverts',
      mainDescription: 'Une expertise complète en infrastructures modernes, de la configuration réseau à la sécurité informatique.',
      features: [
        {
          title: 'Config et Admin Réseau',
          description: 'Explorez les fondamentaux et les aspects avancés de la configuration réseau, incluant la gestion des protocoles, la sécurité, et l\'optimisation des performances.'
        },
        {
          title: 'Architecture des Systèmes',
          description: 'Découvrez les principes d\'architecture des systèmes informatiques, avec une attention particulière sur les infrastructures réseau modernes.'
        },
        {
          title: 'Sécurité et Surveillance',
          description: 'Apprenez les meilleures pratiques en matière de sécurité réseau, de monitoring et de maintenance des infrastructures informatiques.'
        }
      ]
    }
  ];

  // Pourquoi Choisir Notre Plateforme
  featureItems: FeatureItem[] = [
    {
      number: '1',
      title: '1. Apprentissage Simplifié',
      description: 'AYJI vous offre des ressources pédagogiques claires et accessibles, conçues pour simplifier les concepts complexes des Systèmes et Réseaux Informatiques.',
      class: '_1-1'
    },
    {
      number: '2',
      title: '2. Accessibilité et Sécurité',
      description: 'Étudiez à votre rythme, où que vous soyez, grâce à une plateforme accessible sur tous vos appareils. Vos données sont protégées par des technologies de pointe.',
      class: '_1-2'
    },
    {
      number: '3',
      title: '3. Contenus Riches et Évolutifs',
      description: 'Profitez d\'une variété de ressources adaptées à votre niveau, enrichies par des mises à jour régulières pour rester à jour dans votre apprentissage.',
      class: '_2-3'
    },
    {
      number: '4',
      title: '4. Accompagnement Personnalisé',
      description: 'Bénéficiez d\'un support personnalisé et d\'outils interactifs qui vous aident à progresser efficacement dans vos études.',
      class: '_2-2'
    }
  ];

  // Statut d'affichage du bouton de retour en haut
  showScrollButton = false;
  buttonState = 'normal';

  // États des features pour l'animation hover
  featureStates: { [key: string]: string } = {};

  // États des cartes d'expertise pour l'animation hover
  expertiseCardStates: { [key: number]: string } = {};

  // États des éléments de fonctionnalité pour l'animation hover
  featureItemStates: { [key: string]: string } = {};

  constructor(
    public router: Router, 
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    // Initialisation du composant
    this.checkScreenSize();
    
    // S'abonner aux changements d'état de la sidebar
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(expanded => {
      this.isSidebarExpanded = expanded;
      this.updateSidebarStyles();
    });
    
    // Initialiser les styles de la sidebar
    this.updateSidebarStyles();
    
    // Initialiser les états des features
    this.featureItems.forEach(item => {
      this.featureStates[item.number] = 'normal';
    });

    // Initialiser les états des cartes d'expertise
    this.expertiseCards.forEach((_, index) => {
      this.expertiseCardStates[index] = 'normal';
    });

    // Initialiser les états des éléments de fonctionnalité
    this.expertiseCards.forEach((card, cardIndex) => {
      card.features.forEach((_, featureIndex) => {
        this.featureItemStates[`${cardIndex}-${featureIndex}`] = 'normal';
      });
    });
  }

  ngOnDestroy() {
    // Nettoyer l'abonnement
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  // Fonction pour démarrer l'apprentissage
  startLearning() {
    // Vérifier si l'utilisateur est connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/cours']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  // Fonction pour le retour en haut
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Détection du scroll pour afficher le bouton de retour en haut
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 500;
  }

  // Détection du changement de taille de fenêtre pour adaptation responsive
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  // Mise à jour des styles CSS basés sur l'état de la sidebar
  private updateSidebarStyles() {
    document.documentElement.style.setProperty(
      '--sidebar-width', 
      this.isSidebarExpanded ? '139px' : '60px'
    );
    
    // Ajouter ou supprimer la classe sur l'élément main-frame
    const mainFrame = document.querySelector('.main-frame');
    if (mainFrame) {
      if (this.isSidebarExpanded) {
        mainFrame.classList.add('sidebar-expanded');
      } else {
        mainFrame.classList.remove('sidebar-expanded');
      }
    }
  }

  // Vérifier la taille de l'écran pour ajuster l'interface
  private checkScreenSize() {
    const isMobile = window.innerWidth <= 768;
    
    // Si mobile, fermer automatiquement la sidebar
    if (isMobile && this.isSidebarExpanded) {
      this.sidebarService.setSidebarState(false);
    }
  }

  // Méthode pour gérer le hover des features
  onFeatureHover(number: string, isHovered: boolean): void {
    this.featureStates[number] = isHovered ? 'hovered' : 'normal';
  }
  
  // Méthode pour définir l'onglet actif
  setActiveFeatureTab(index: number): void {
    this.activeFeatureTab = index;
  }
  
  // Méthode pour déterminer si une fonctionnalité doit être visible en fonction de l'onglet actif (conservée pour compatibilité)
  isFeatureVisible(item: FeatureItem): boolean {
    // Si l'élément est le premier (index 0), montrer uniquement quand l'onglet 0 est actif
    if (item.number === '1') return this.activeFeatureTab === 0;
    // Si l'élément est le deuxième (index 1), montrer uniquement quand l'onglet 1 est actif
    if (item.number === '2') return this.activeFeatureTab === 1;
    // Si l'élément est le troisième (index 2), montrer uniquement quand l'onglet 2 est actif
    if (item.number === '3') return this.activeFeatureTab === 2;
    // Si l'élément est le quatrième (index 3), montrer uniquement quand l'onglet 3 est actif
    if (item.number === '4') return this.activeFeatureTab === 3;
    
    // Par défaut, afficher l'élément
    return true;
  }

  // Méthode pour déterminer si une fonctionnalité est active (sélectionnée)
  isFeatureActive(item: FeatureItem): boolean {
    // Si l'élément est le premier (index 0), actif quand l'onglet 0 est sélectionné
    if (item.number === '1') return this.activeFeatureTab === 0;
    // Si l'élément est le deuxième (index 1), actif quand l'onglet 1 est sélectionné
    if (item.number === '2') return this.activeFeatureTab === 1;
    // Si l'élément est le troisième (index 2), actif quand l'onglet 2 est sélectionné
    if (item.number === '3') return this.activeFeatureTab === 2;
    // Si l'élément est le quatrième (index 3), actif quand l'onglet 3 est sélectionné
    if (item.number === '4') return this.activeFeatureTab === 3;
    
    // Par défaut, non actif
    return false;
  }

  // Méthode pour gérer le hover des cartes d'expertise
  onExpertiseCardHover(index: number, isHovered: boolean) {
    this.expertiseCardStates[index] = isHovered ? 'hovered' : 'normal';
  }

  // Méthode pour gérer le hover des éléments de fonctionnalité
  onFeatureItemHover(cardIndex: number, featureIndex: number, isHovered: boolean) {
    this.featureItemStates[`${cardIndex}-${featureIndex}`] = isHovered ? 'hovered' : 'normal';
  }
}
