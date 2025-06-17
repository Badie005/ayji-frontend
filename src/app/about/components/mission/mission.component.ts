import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

interface Objective {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pillarAnimation', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition(':enter', [
        animate('400ms 300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('objectiveAnimation', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter', [
        animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class MissionComponent implements OnInit {
  vision: string = "AYJI a été créée avec la conviction profonde que l'apprentissage des Systèmes et Réseaux Informatiques devrait être accessible à tous, interactif et adapté aux besoins d'aujourd'hui. Notre mission est de démocratiser l'accès à une éducation de qualité en SRI, en proposant des contenus pédagogiques innovants et des méthodes d'apprentissage qui correspondent aux attentes des étudiants et des professionnels en formation continue.";
  
  pillars: Pillar[] = [
    {
      icon: 'fas fa-universal-access',
      title: 'Accessibilité',
      description: "Rendre l'apprentissage des SRI accessible à tous, indépendamment de la localisation géographique, du niveau d'étude ou des moyens financiers."
    },
    {
      icon: 'fas fa-award',
      title: 'Qualité',
      description: "Proposer des contenus pédagogiques de haute qualité, rédigés par des experts et constamment mis à jour pour refléter les dernières évolutions technologiques."
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation',
      description: "Développer des méthodes d'apprentissage innovantes qui tirent parti des dernières avancées en matière de pédagogie numérique."
    }
  ];
  
  objectives: Objective[] = [
    {
      icon: 'fas fa-graduation-cap',
      title: 'Éducation Pour Tous',
      description: "Permettre à au moins 10 000 étudiants de bénéficier de nos ressources gratuites d'ici la fin de l'année, et doubler ce chiffre chaque année."
    },
    {
      icon: 'fas fa-users',
      title: 'Communauté d\'Entraide',
      description: "Favoriser l'émergence d'une communauté d'apprentissage collaborative où les étudiants peuvent s'entraider et partager leurs connaissances."
    },
    {
      icon: 'fas fa-handshake',
      title: 'Connexion avec l\'Industrie',
      description: "Créer des ponts entre la formation académique et les besoins réels de l'industrie, préparant ainsi les étudiants à intégrer efficacement le marché du travail."
    }
  ];

  visibilityState = { pillars: true, objectives: true };

  ngOnInit(): void {
    // Initialisation du composant
  }

  toggleSection(section: 'pillars' | 'objectives'): void {
    this.visibilityState[section] = !this.visibilityState[section];
  }
}