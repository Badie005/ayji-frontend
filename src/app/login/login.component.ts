// login.component.ts

// Angular Core
import { Component, OnInit, OnDestroy } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// RxJS
import { Subscription, finalize, catchError, map, of } from 'rxjs';

// Services
import { AuthService, User } from '../core/services/auth.service';
import { LoadingService } from '../core/services/loading.service';
import { 
  ErrorHandlerService, 
  AppError, 
  ErrorType 
} from '../core/services/error-handler.service';

// Interfaces
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email: string | null;
  password: string | null;
  form: string | null;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  returnUrl: string = '/cours'; // Redirection vers la page de cours après connexion pour les étudiants
  adminUrl: string = '/admin'; // Redirection vers le tableau de bord pour les administrateurs
  
  // Typed form controls
  formControls: { [key: string]: AbstractControl } = {};
  
  // Error states
  formErrors: FormErrors = {
    email: null,
    password: null,
    form: null
  };
  
  // Track subscriptions for cleanup
  private subscriptions: Subscription[] = [];
  
  // Loading key for this component
  private readonly LOADING_KEY = 'login-form';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loadingService: LoadingService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.currentUserValue) {
      this.router.navigate([this.returnUrl]);
      return;
    }

    // Récupérer l'URL de retour des query params ou utiliser la valeur par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cours';
    
    this.initForm();
    
    // Vérifier si l'utilisateur vient de s'inscrire
    const routeSub = this.route.queryParams.subscribe(params => {
      const registered = params['registered'];
      const email = params['email'];
      
      if (registered === 'success' && email) {
        this.successMessage = 'Inscription réussie ! Veuillez vous connecter avec vos identifiants.';
        this.loginForm.patchValue({ email: email });
      }
    });
    
    this.subscriptions.push(routeSub);
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberMe: [false]
    });
    
    // Store form controls for easier access with type safety
    this.formControls = {
      email: this.loginForm.get('email')!,
      password: this.loginForm.get('password')!,
      rememberMe: this.loginForm.get('rememberMe')!
    };
    
    // Subscribe to form changes to clear validation messages
    const formChangeSub = this.loginForm.valueChanges.subscribe(() => {
      if (this.submitted) {
        this.validateForm();
      }
    });
    
    this.subscriptions.push(formChangeSub);
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  /**
   * Validate form and update error messages
   */
  validateForm(): void {
    this.formErrors = {
      email: null,
      password: null,
      form: null
    };
    
    // Email validation
    const emailControl = this.formControls['email'];
    if (emailControl.errors) {
      if (emailControl.errors['required']) {
        this.formErrors.email = 'L\'email est obligatoire';
      } else if (emailControl.errors['email']) {
        this.formErrors.email = 'Veuillez entrer une adresse email valide';
      } else if (emailControl.errors['maxlength']) {
        this.formErrors.email = 'L\'email ne peut pas dépasser 100 caractères';
      }
    }
    
    // Password validation
    const passwordControl = this.formControls['password'];
    if (passwordControl.errors) {
      if (passwordControl.errors['required']) {
        this.formErrors.password = 'Le mot de passe est obligatoire';
      } else if (passwordControl.errors['minlength']) {
        this.formErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validate form
    this.validateForm();

    // Si le formulaire est invalide, arrêter ici
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loadingService.setLoadingState(this.LOADING_KEY, true, 'Login');

    // Extract typed credentials from form
    const credentials: LoginCredentials = {
      email: this.formControls['email'].value,
      password: this.formControls['password'].value,
      rememberMe: this.formControls['rememberMe'].value
    };

    // Appel au service d'authentification
    const loginSub = this.authService.login(
      credentials.email,
      credentials.password,
      credentials.rememberMe
    )
    .pipe(
      map(response => response?.user || null), // Transform LoginResponse to User
      catchError((error: HttpErrorResponse) => {
        const appError = this.handleLoginError(error);
        this.errorMessage = appError.message;
        return of(null); // Return null to continue in the subscribe block
      }),
      finalize(() => {
        this.loading = false;
        this.loadingService.setLoadingState(this.LOADING_KEY, false, 'Login');
      })
    )
    .subscribe({
      next: (user: User | null) => {
        // Only navigate if login was successful
        if (user) {
          console.log('Connexion réussie pour:', user.email);
          
          // Rediriger l'utilisateur en fonction de son rôle
          if (user.role === 'admin') {
            console.log('Redirection vers le tableau de bord administrateur');
            this.router.navigate([this.adminUrl]);
          } else {
            console.log('Redirection vers la page des cours');
            this.router.navigate([this.returnUrl]);
          }
        }
      }
    });
    
    this.subscriptions.push(loginSub);
  }
  
  /**
   * Process login errors with appropriate user-friendly messages
   */
  private handleLoginError(error: HttpErrorResponse): AppError {
    console.error('Erreur de connexion:', error);
    
    // Create a default error
    let appError: AppError = {
      type: ErrorType.AUTH,
      message: 'Email ou mot de passe incorrect',
      technical: error.message,
      status: error.status,
      timestamp: new Date(),
      path: 'login'
    };
    
    // Process based on error type
    if (error.error && error.error.message) {
      appError.message = error.error.message;
    } else if (error.status === 0) {
      appError.type = ErrorType.NETWORK;
      appError.message = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
    } else if (error.status === 401) {
      appError.message = 'Email ou mot de passe incorrect';
    } else if (error.status === 429) {
      appError.type = ErrorType.VALIDATION;
      appError.message = 'Trop de tentatives de connexion. Veuillez réessayer dans quelques minutes.';
    } else if (error.status >= 500) {
      appError.type = ErrorType.SERVER;
      appError.message = 'Une erreur est survenue côté serveur. Veuillez réessayer plus tard.';
    }
    
    return appError;
  }
  
  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
