// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
// Importez ici votre service d'authentification
// import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    // private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Récupérer l'URL de retour des paramètres de requête ou utiliser '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Si le formulaire est invalide, arrêter ici
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    // Appel au service d'authentification
    // Exemple:
    /*
    this.authService.register(
      this.f['email'].value,
      this.f['password'].value,
      this.f['rememberMe'].value
    ).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        this.errorMessage = error.message || 'Identifiants incorrects';
        this.loading = false;
      }
    });
    */

    // En attendant l'implémentation du service:
    console.log('Tentative de connexion', {
      email: this.f['email'].value,
      password: this.f['password'].value,
      rememberMe: this.f['rememberMe'].value
    });

    // Simuler une connexion réussie (à remplacer par l'appel au service)
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/']);
    }, 1000);
  }
}
