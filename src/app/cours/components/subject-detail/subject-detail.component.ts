// src/app/cours/components/subject-detail/subject-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SubjectService } from '../../../services/subject.service';
import { CourseService } from '../../../services/course.service';
import { Subject } from '../../../core/models/subject.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-subject-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div *ngIf="subject">
        <h2>{{ subject.name }}</h2>
        <p>{{ subject.description }}</p>
        
        <div class="mt-4">
          <h3>Cours disponibles</h3>
          <div class="list-group">
            <a *ngFor="let course of courses" 
              [routerLink]="['/cours/course', course._id]"
              class="list-group-item list-group-item-action">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ course.title }}</h5>
              </div>
              <p class="mb-1">{{ course.description }}</p>
            </a>
          </div>
          <div *ngIf="courses.length === 0" class="alert alert-info mt-3">
            Aucun cours disponible pour cette matière.
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
      
      <div class="mt-4">
        <a [routerLink]="['/cours']" class="btn btn-secondary">Retour aux matières</a>
      </div>
    </div>
  `
})
export class SubjectDetailComponent implements OnInit {
  subject: Subject | null = null;
  courses: Course[] = [];
  loading = false;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectService,
    private courseService: CourseService
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const subjectId = params.get('id');
      if (subjectId) {
        this.loadSubject(subjectId);
        this.loadCourses(subjectId);
      }
    });
  }
  
  loadSubject(id: string): void {
    this.loading = true;
    this.subjectService.getSubjectById(id)
      .subscribe({
        next: (data) => {
          this.subject = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement de la matière.';
          this.loading = false;
          console.error('Erreur:', err);
        }
      });
  }
  
  loadCourses(subjectId: string): void {
    this.courseService.getCoursesBySubject(subjectId)
      .subscribe({
        next: (data) => {
          this.courses = data;
        },
        error: (err) => {
          this.error = 'Erreur lors du chargement des cours.';
          console.error('Erreur:', err);
        }
      });
  }
}