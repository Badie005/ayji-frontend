import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  menuItems = [
    { text: 'Accueil', route: '/accueil' },
    { text: 'About', route: '/about' },
    { text: 'Connecter', route: '/connecter' },
    { text: 'Cours', route: '/cours' }
  ];
}
