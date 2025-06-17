// src/app/admin/components/user-edit/user-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserManagementService } from '../../services/user-management.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userId: string = '';
  user: User | null = null;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagementService
  ) {
    this.userForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.userId) {
      this.router.navigate(['/admin/users']);
      return;
    }

    this.loading = true;
    console.log('Demande d\'édition de l\'utilisateur avec ID:', this.userId);
    
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Utilisateur récupéré pour édition:', user);
        this.user = user;
        this.userForm.patchValue({
          nom: user.nom || '',
          prenom: user.prenom || '',
          email: user.email || '',
          role: user.role || 'etudiant'
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur détaillée lors du chargement de l\'utilisateur:', error);
        this.errorMessage = 'Utilisateur non trouvé ou erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre';
      return;
    }
    
    console.log('Soumission du formulaire de mise à jour avec données:', this.userForm.value);
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const userData = {
      ...this.userForm.value,
      _id: this.userId // S'assurer que l'ID est inclus
    };
    
    this.userService.updateUser(this.userId, userData).subscribe({
      next: (updatedUser) => {
        console.log('Utilisateur mis à jour avec succès:', updatedUser);
        this.loading = false;
        this.successMessage = 'Utilisateur mis à jour avec succès';
        
        // Redirection après un court délai pour montrer le message de succès
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur détaillée lors de la mise à jour:', error);
        this.loading = false;
        this.errorMessage = error.message || 'Erreur lors de la mise à jour de l\'utilisateur';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}