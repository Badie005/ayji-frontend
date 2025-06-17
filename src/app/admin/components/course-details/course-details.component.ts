// src/app/admin/components/course-details/course-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Course } from '../../../core/models/course.model';
import { CourseManagementService } from '../../services/course-management.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CourseDetailsComponent implements OnInit {
  course: Course | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private courseService: CourseManagementService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
    const courseId = this.route.snapshot.paramMap.get('id');
    
    if (courseId) {
      this.loadCourseDetails(courseId);
    } else {
      this.errorMessage = 'Identifiant de cours manquant';
      this.loading = false;
    }
  }

  loadCourseDetails(id: string): void {
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        console.log('Détails du cours récupérés:', course);
        this.course = course;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails du cours:', error);
        this.errorMessage = 'Impossible de récupérer les détails du cours';
        this.loading = false;
      }
    });
  }

  editCourse(): void {
    if (this.course) {
      this.router.navigate(['/admin/courses/edit', this.course._id]);
    }
  }

  deleteCourse(): void {
    if (!this.course) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      this.loading = true;
      this.courseService.deleteCourse(this.course._id).subscribe({
        next: () => {
          console.log('Cours supprimé avec succès');
          this.router.navigate(['/admin/courses']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du cours:', error);
          this.errorMessage = 'Impossible de supprimer le cours';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/courses']);
  }

  getChapitres(): any[] {
    // Simuler des chapitres (à remplacer par une vraie implémentation)
    return [
      { 
        titre: 'Introduction', 
        description: 'Introduction au sujet du cours',
        duree: '15 min' 
      },
      { 
        titre: 'Concepts fondamentaux', 
        description: 'Les concepts de base à comprendre',
        duree: '30 min' 
      },
      { 
        titre: 'Applications pratiques', 
        description: 'Application des concepts dans des situations réelles',
        duree: '45 min' 
      }
    ];
  }
}
