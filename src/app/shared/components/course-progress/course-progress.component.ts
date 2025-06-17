import { Component, Input, OnInit } from '@angular/core';
import { Progression } from '../../../core/models/progression.model';
import { ProgressionService } from '../../../services/progression.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CourseProgressComponent implements OnInit {
  @Input() courseId: string = '';
  progression: Progression | null = null;
  userId: string = '';
  loading = true;

  constructor(
    private progressionService: ProgressionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur et son ID
    this.initUserId();
    
    if (this.courseId) {
      this.loadProgression();
    }
  }

  initUserId(): void {
    // On utilise une valeur par défaut temporaire pour le développement
    this.userId = 'default_user_id';
    
    // Dans une application réelle, on récupérerait l'ID depuis le token ou via un appel API
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe(
        (userData) => {
          if (userData && userData._id) {
            this.userId = userData._id;
            // Recharger la progression une fois l'ID récupéré
            if (this.courseId) {
              this.loadProgression();
            }
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      );
    }
  }

  loadProgression(): void {
    if (!this.userId) {
      console.error('ID utilisateur non disponible');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.progressionService.getCourseProgression(this.userId, this.courseId).subscribe(
      progression => {
        this.progression = progression;
        this.loading = false;
        
        // Si aucune progression n'existe, en créer une nouvelle
        if (!progression._id) {
          this.createNewProgression();
        }
      },
      error => {
        console.error('Erreur lors du chargement de la progression:', error);
        this.loading = false;
      }
    );
  }

  createNewProgression(): void {
    const newProgression: Partial<Progression> = {
      user: this.userId,
      course: this.courseId,
      completed: false,
      progress: 0,
      lastAccessed: new Date()
    };
    
    this.progressionService.updateProgression('new', newProgression).subscribe(
      progression => {
        this.progression = progression;
      },
      error => {
        console.error('Erreur lors de la création de la progression:', error);
      }
    );
  }

  updateProgress(percentage: number): void {
    if (!this.progression || !this.progression._id) return;
    
    const update: Partial<Progression> = {
      progress: percentage,
      completed: percentage >= 100,
      lastAccessed: new Date()
    };
    
    this.progressionService.updateProgression(this.progression._id, update).subscribe(
      updatedProgression => {
        this.progression = updatedProgression;
      },
      error => {
        console.error('Erreur lors de la mise à jour de la progression:', error);
      }
    );
  }
}
