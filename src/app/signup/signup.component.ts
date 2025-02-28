// signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf, NgStyle } from '@angular/common';
// Importez ici votre service d'authentification
// import { AuthService } from '../core/services/auth.service';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgIf,
    NgStyle
  ],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    // private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Initialisation du formulaire avec validation
  initForm(): void {
    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  // Validation pour vérifier que les mots de passe correspondent
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() {
    return this.registerForm.controls;
  }

  // Fonction pour afficher/masquer le mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Fonction pour afficher/masquer la confirmation du mot de passe
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validation en temps réel des champs
  getPasswordStrength(): { text: string, color: string } {
    const password = this.f['password'].value || '';

    if (!password) {
      return { text: '', color: '' };
    }

    if (password.length < 8) {
      return { text: 'Faible', color: '#dc3545' };
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (strength <= 2) {
      return { text: 'Moyen', color: '#ffc107' };
    } else if (strength === 3) {
      return { text: 'Bon', color: '#28a745' };
    } else {
      return { text: 'Excellent', color: '#198754' };
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.registerForm.reset();
    this.errorMessage = '';
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Si le formulaire est invalide, arrêter ici
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulation d'une requête API avec un délai
    setTimeout(() => {
      try {
        // Ici, vous pourriez appeler votre service d'authentification
        console.log('Formulaire d\'inscription valide', this.registerForm.value);

        // Exemple de redirection après inscription réussie
        this.router.navigate(['/login']);

        this.loading = false;
        // Pour tester, décommentez la ligne suivante:
        // throw new Error('Erreur de connexion au serveur');
      } catch (error) {
        this.loading = false;
        this.errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      }
    }, 1000);
  }
}
