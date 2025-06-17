// src/app/core/guards/admin.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUserValue;
  
  if (currentUser && currentUser.role === 'admin') {
    return true;
  }
  
  // Rediriger vers la page d'accueil si l'utilisateur n'est pas un admin
  router.navigate(['/home']);
  return false;
};