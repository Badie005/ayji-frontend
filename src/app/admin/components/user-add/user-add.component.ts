// src/app/admin/components/user-add/user-add.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserAddComponent {
  userForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserManagementService,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
      role: ['etudiant', Validators.required]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.userForm.invalid) {
      return;
    }

    // Renommer motDePasse en password pour correspondre à l'attente du backend
    const userData = {
      ...this.userForm.value,
      password: this.userForm.value.motDePasse
    };
    
    delete userData.motDePasse;

    this.loading = true;
    this.userService.addUser(userData).subscribe({
      next: () => {
        this.router.navigate(['/admin/users'], {
          queryParams: { created: 'success' }
        });
      },
      error: (error) => {
        this.loading = false;
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la création de l\'utilisateur';
        }
        console.error('Erreur lors de la création de l\'utilisateur', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}