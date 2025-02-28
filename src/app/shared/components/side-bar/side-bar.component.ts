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
    { text: 'Accueil', route: '/home' }, // Changez '/accueil' en '/home'
    { text: 'About', route: '/about' },  // Cette route n'existe pas encore dans app.routes.ts
    { text: 'Connecter', route: '/connecter' }, // Cette route n'existe pas encore dans app.routes.ts
    { text: 'Cours', route: '/cours' }  // Cette route n'existe pas encore dans app.routes.ts
  ];
}
