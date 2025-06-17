// Fichier temporairement adapté en attendant l'installation correcte de NgRx

import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import * as UserActions from './user.actions';

/**
 * Effets pour les actions liées à l'utilisateur
 * Cette classe est temporairement désactivée en attendant l'installation de NgRx
 */
@Injectable()
export class UserEffects {
  // Version temporaire pour permettre la compilation
  constructor(
    // private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // Commenté en attendant l'installation de NgRx
  /*
  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.login),
      switchMap(({ email, password, rememberMe }) => 
        this.authService.login(email, password, rememberMe).pipe(
          map(response => {
            if (response && response.user && response.token) {
              return UserActions.loginSuccess({ 
                user: response.user, 
                token: response.token 
              });
            }
            return UserActions.loginFailure({ 
              error: new Error('Invalid response from server') 
            });
          }),
          catchError(error => of(UserActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.loginSuccess),
      tap(({ user }) => {
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.logout),
      switchMap(() => 
        this.authService.logout().pipe(
          map(() => UserActions.logoutSuccess()),
          catchError(error => of(UserActions.logoutFailure({ error })))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(() => 
    this.actions$.pipe(
      ofType(UserActions.logoutSuccess),
      tap(() => {
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUser),
      switchMap(() =>
        this.authService.getCurrentUser().pipe(
          map(user => UserActions.loadUserSuccess({ user })),
          catchError(error => of(UserActions.loadUserFailure({ error })))
        )
      )
    )
  );
  */
}
