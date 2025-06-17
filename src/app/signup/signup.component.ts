// signup.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Importez le service d'authentification
import { AuthService } from '../core/services/auth.service';

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
export class SignupComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';
  
  // Pour gérer la désabonnement des observables
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialisation du formulaire avec validation avancée
  initForm(): void {
    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      prenom: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
        this.noWhitespaceValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.mustMatch('password', 'confirmPassword')]
    });
  }

  // Configurer les listeners pour le formulaire
  setupFormListeners(): void {
    // Validation en temps réel du mot de passe
    this.registerForm.get('password')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        // Réinitialiser la validation de confirmPassword si le mot de passe change
        if (this.registerForm.get('confirmPassword')?.value) {
          this.registerForm.get('confirmPassword')?.updateValueAndValidity();
        }
      });
  }

  // Validation pour vérifier que les mots de passe correspondent
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  // Validateur pour empêcher les espaces seuls
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
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

  // Obtenir le pourcentage de force du mot de passe pour la barre de progression
  getPasswordStrengthPercentage(): number {
    const password = this.f['password'].value || '';
    
    if (!password) return 0;
    if (password.length < 8) return 25;
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    
    const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    
    return Math.min(25 + (strength * 25), 100); // 25% par critère, maximum 100%
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.registerForm.reset();
    this.errorMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Si le formulaire est invalide, arrêter ici
    if (this.registerForm.invalid) {
      // Focus sur le premier champ invalide
      this.focusFirstInvalidField();
      return;
    }

    this.loading = true;

    // Récupérer les données du formulaire sans confirmPassword
    const { confirmPassword, ...userData } = this.registerForm.value;
    
    console.log('Données du formulaire:', userData);
    
    // Appel au service d'authentification pour l'inscription
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        
        // Stockez temporairement l'email pour faciliter la connexion
        localStorage.setItem('lastRegisteredEmail', userData.email);
        
        // Afficher un message de réussite avant de rediriger
        alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
        
        // Redirection vers la page de connexion avec un message de succès
        this.router.navigate(['/login'], { 
          queryParams: { 
            registered: 'success',
            email: userData.email
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou contacter l\'administrateur.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
        }
        this.loading = false;
      }
    });
  }

  // Focus sur le premier champ invalide
  private focusFirstInvalidField(): void {
    const invalidControls = this.findInvalidControls();
    if (invalidControls.length > 0) {
      const firstControlName = invalidControls[0];
      const element = document.getElementById(firstControlName);
      if (element) {
        element.focus();
      }
    }
  }

  // Trouver tous les contrôles invalides
  private findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.registerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
}
