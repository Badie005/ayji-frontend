import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(currentUser => {
        // Vérifier si l'utilisateur existe et a un token valide
        if (currentUser && currentUser.token) {
          console.log('AuthGuard: Utilisateur authentifié avec le rôle', currentUser.role);
          
          // Vérification optionnelle du rôle requis pour la route
          const requiredRole = route.data['role'] as string;
          if (requiredRole && currentUser.role !== requiredRole) {
            console.log(`AuthGuard: Rôle requis ${requiredRole} mais l'utilisateur a ${currentUser.role}`);
            this.router.navigate(['/']);
            return false;
          }
          
          return true;
        }

        // Si pas authentifié, rediriger vers login avec l'URL de retour
        console.log('AuthGuard: Utilisateur non authentifié, redirection vers login');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}