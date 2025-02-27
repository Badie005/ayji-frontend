import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  mainTitle = 'Maîtrisez les Systèmes et Réseaux Informatiques avec nos Cours Simplifiés.';
  subTitle = 'Transforme tes études en une expérience interactive et passionnante grâce à notre plateforme innovante.';
  
  startLearning() {
    // Logique pour commencer l'apprentissage
    console.log("Commencer l'apprentissage");
  }

  title = 'Bienvenue sur notre site';
  mainContent = {
    heading: 'Notre Page Principale',
    description: 'Découvrez tout ce que nous avons à offrir',
    features: [
      {
        title: 'Service 1',
        description: 'Description du premier service'
      },
      {
        title: 'Service 2',
        description: 'Description du deuxième service'
      },
      {
        title: 'Service 3',
        description: 'Description du troisième service'
      }
    ]
  };

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
