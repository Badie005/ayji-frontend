import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Composant principal pour les pages légales
 * Agit comme conteneur pour les routes enfants
 */
@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LegalComponent {
  // Ce composant sert de conteneur pour les différentes pages légales
}
