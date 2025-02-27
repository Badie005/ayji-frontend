// home.component.ts amélioré
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  mainTitle = 'Maîtrisez les Systèmes et Réseaux Informatiques avec nos Cours Simplifiés.';
  subTitle = 'Transforme tes études en une expérience interactive et passionnante grâce à notre plateforme innovante.';

  // Propriétés pour les cartes de fonctionnalités
  features = [
    {
      title: 'Fondamentaux des Réseaux',
      description: 'Maîtrisez les concepts essentiels des systèmes et réseaux informatiques à travers des contenus pédagogiques structurés.'
    },
    {
      title: 'Concepts Avancés du SRI',
      description: 'Approfondissez vos connaissances avec des modules spécialisés couvrant les aspects complexes des réseaux informatiques.'
    },
    {
      title: 'Parcours d\'Apprentissage',
      description: 'Un apprentissage interactif et structuré combinant théorie, pratique et accompagnement personnalisé pour votre réussite.'
    }
  ];

  // Flag pour afficher le bouton de retour en haut
  showScrollButton = false;
  isMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialisation du composant
  }

  startLearning(): void {
    // Navigation vers la page des cours
    console.log("Commencer l'apprentissage");
    // this.router.navigate(['/courses']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Écouteur d'événement pour détecter le défilement
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Afficher le bouton de retour en haut lorsque l'utilisateur fait défiler la page
    this.showScrollButton = window.scrollY > 300;
  }
}
