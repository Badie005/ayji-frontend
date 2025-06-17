import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exercices',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exercices.component.html',
  styleUrls: ['./exercices.component.css']
})
export class ExercicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Scrolle vers le haut de la page lors du chargement
    window.scrollTo(0, 0);
    
    // Charger la police Font Awesome si elle n'est pas déjà chargée
    if (!document.getElementById('font-awesome-css')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }
}
