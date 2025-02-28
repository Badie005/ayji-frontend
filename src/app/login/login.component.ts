// login.component.ts
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Initialisation du formulaire avec validation
  initForm(): void {
    this.loginForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
    return this.loginForm.controls;
  }

  // Fonction pour afficher/masquer le mot de passe
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Fonction pour afficher/masquer la confirmation du mot de passe
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Soumission du formulaire
  onSubmit(): void {
    this.submitted = true;

    // Si le formulaire est invalide, arrêter ici
    if (this.loginForm.invalid) {
      return;
    }

    // Ici, vous pourriez appeler votre service d'authentification
    console.log('Formulaire d\'inscription valide', this.loginForm.value);

    // Exemple de redirection après inscription réussie
    // this.router.navigate(['/accueil']);
  }
}
