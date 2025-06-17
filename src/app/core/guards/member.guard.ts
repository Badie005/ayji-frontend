import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const MemberGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUserValue;
  
  if (currentUser && currentUser.role === 'etudiant') {
    return true;
  }
  
  // Rediriger vers la page d'accueil si l'utilisateur n'est pas un étudiant
  router.navigate(['/home']);
  return false;
};
