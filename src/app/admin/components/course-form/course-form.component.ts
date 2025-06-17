// src/app/admin/components/course-form/course-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { CourseManagementService } from '../../services/course-management.service';
import { FileUploadService } from '../../services/file-upload.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CourseFormComponent implements OnInit {
  courseForm!: FormGroup;
  courseId: string | null = null;
  isEditMode = false;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  
  // Propriétés pour l'ordre d'affichage
  suggestedOrder = 7;
  
  // Propriétés pour l'upload de fichiers
  selectedFiles: { [key: string]: File } = {};
  currentFile: { [key: string]: any } = {};
  progress: { [key: string]: number } = {};
  fileNames: { [key: string]: string } = {};
  fileUrls: { [key: string]: string } = {};
  uploadSuccess: { [key: string]: boolean } = {};
  uploadError: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseManagementService,
    private uploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;
    
    if (this.isEditMode && this.courseId) {
      this.loadCourse(this.courseId);
    } else {
      // Nous sommes en mode création, charger l'ordre suggéré
      this.loadSuggestedOrder();
    }
  }

  initializeForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      order: [this.suggestedOrder, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      coursePdfUrl: [''],
      exercisePdfUrl: [''],
      qcmPdfUrl: ['']
    });
  }

  loadSuggestedOrder(): void {
    // L'ordre suggéré est déjà défini à 7 par défaut, mais nous pouvons quand même 
    // vérifier auprès du service pour des cas futurs
    this.courseService.getMaxOrder().subscribe({
      next: (maxOrder) => {
        // Définir suggerestedOrder à max+1, mais au minimum 7
        this.suggestedOrder = Math.max(maxOrder + 1, 7);
        this.courseForm.patchValue({
          order: this.suggestedOrder
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du max order:', err);
        // En cas d'erreur, garder l'ordre suggéré par défaut (7)
      }
    });
  }

  loadCourse(id: string): void {
    this.loading = true;
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        console.log('Cours récupéré pour édition:', course);
        
        // Pré-remplir le formulaire avec les données du cours
        this.courseForm.patchValue({
          title: course.title,
          order: course.order,
          description: course.description,
          coursePdfUrl: course.coursePdfUrl,
          exercisePdfUrl: course.exercisePdfUrl,
          qcmPdfUrl: course.qcmPdfUrl
        });
        
        // Enregistrer les URLs existantes
        if (course.coursePdfUrl) this.fileUrls['course'] = course.coursePdfUrl;
        if (course.exercisePdfUrl) this.fileUrls['exercises'] = course.exercisePdfUrl;
        if (course.qcmPdfUrl) this.fileUrls['qcm'] = course.qcmPdfUrl;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du cours:', error);
        this.errorMessage = 'Impossible de récupérer les données du cours';
        this.loading = false;
      }
    });
  }

  // Gérer la sélection de fichier
  selectFile(event: any, type: string): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles[type] = files[0];
      this.fileNames[type] = files[0].name;
      
      // Réinitialiser les messages d'état pour ce type de fichier
      this.progress[type] = 0;
      this.uploadSuccess[type] = false;
      this.uploadError[type] = '';
    }
  }

  // Uploader un fichier
  uploadFile(type: string): void {
    if (!this.selectedFiles[type]) {
      this.uploadError[type] = 'Aucun fichier sélectionné';
      return;
    }

    this.progress[type] = 0;
    this.currentFile[type] = this.selectedFiles[type];

    this.uploadService.upload(this.currentFile[type], type).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress[type] = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          console.log('Réponse de l\'upload:', event.body);
          
          if (event.body && event.body.fileUrl) {
            this.fileUrls[type] = event.body.fileUrl;
            
            // Mettre à jour le formulaire avec l'URL du fichier
            const formField = this.getFormFieldForFileType(type);
            if (formField) {
              this.courseForm.patchValue({ [formField]: event.body.fileUrl });
            }
            
            this.uploadSuccess[type] = true;
            this.fileNames[type] = event.body.fileName || this.fileNames[type];
          } else {
            this.uploadError[type] = 'L\'upload a réussi mais aucune URL n\'a été retournée';
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors de l\'upload:', err);
        this.progress[type] = 0;
        this.uploadError[type] = `Erreur lors de l'upload: ${err.message}`;
        this.currentFile[type] = undefined;
      }
    });
    
    // Réinitialiser le fichier sélectionné après l'upload
    delete this.selectedFiles[type];
  }

  // Suppression d'un fichier
  deleteFile(type: string): void {
    if (!this.fileUrls[type]) return;
    
    this.loading = true;
    this.uploadService.deleteFile(this.fileUrls[type]).subscribe({
      next: () => {
        // Réinitialiser le champ de formulaire
        const formField = this.getFormFieldForFileType(type);
        if (formField) {
          this.courseForm.patchValue({ [formField]: '' });
        }
        
        this.fileUrls[type] = '';
        this.fileNames[type] = '';
        this.uploadSuccess[type] = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du fichier:', error);
        this.uploadError[type] = 'Impossible de supprimer le fichier';
        this.loading = false;
      }
    });
  }

  getFormFieldForFileType(type: string): string | null {
    switch (type) {
      case 'course': return 'coursePdfUrl';
      case 'exercises': return 'exercisePdfUrl';
      case 'qcm': return 'qcmPdfUrl';
      default: return null;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.courseForm.invalid) {
      console.log('Formulaire invalide:', this.courseForm.errors);
      return;
    }
    
    this.loading = true;
    const courseData = { ...this.courseForm.value };
    
    if (this.isEditMode && this.courseId) {
      this.updateCourse(this.courseId, courseData);
    } else {
      this.createCourse(courseData);
    }
  }

  createCourse(courseData: Partial<Course>): void {
    this.courseService.addCourse(courseData).subscribe({
      next: (response) => {
        console.log('Cours créé avec succès:', response);
        this.successMessage = 'Cours créé avec succès';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/courses']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors de la création du cours:', error);
        this.errorMessage = 'Impossible de créer le cours';
        this.loading = false;
      }
    });
  }

  updateCourse(id: string, courseData: Partial<Course>): void {
    this.courseService.updateCourse(id, courseData).subscribe({
      next: (response) => {
        console.log('Cours mis à jour avec succès:', response);
        this.successMessage = 'Cours mis à jour avec succès';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/courses']);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du cours:', error);
        this.errorMessage = 'Impossible de mettre à jour le cours';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/courses']);
  }
}
