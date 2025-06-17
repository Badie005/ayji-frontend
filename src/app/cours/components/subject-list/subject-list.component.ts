// src/app/cours/components/subject-list/subject-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Matières disponibles</h2>
      <div class="row">
        <div *ngFor="let subject of subjects" class="col-md-4 mb-4">
          <div class="card h-100">
            <img *ngIf="subject.image" [src]="subject.image" class="card-img-top" alt="{{ subject.name }}">
            <div class="card-body">
              <h5 class="card-title">{{ subject.name }}</h5>
              <p class="card-text">{{ subject.description }}</p>
              <a [routerLink]="['/cours', subject._id]" class="btn btn-primary">Voir les cours</a>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="loading" class="text-center mt-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
      <div *ngIf="error" class="alert alert-danger mt-4">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.3s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;

  constructor(private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.error = null;
    
    this.subjectService.getAllSubjects()
      .subscribe({
        next: (data) => {
          this.subjects = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des matières. Veuillez réessayer.';
          this.loading = false;
          console.error('Erreur:', err);
        }
      });
  }
}