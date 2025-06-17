// Fichier temporairement adapté en attendant l'installation correcte de NgRx

// import { createAction, props } from '@ngrx/store';
// import { User } from '../../shared/models/user.model';

// Définition des types d'actions
export enum UserActionTypes {
  LOAD_USER = '[User] Load User',
  LOAD_USER_SUCCESS = '[User] Load User Success',
  LOAD_USER_FAILURE = '[User] Load User Failure',
  
  LOGIN = '[User] Login',
  LOGIN_SUCCESS = '[User] Login Success',
  LOGIN_FAILURE = '[User] Login Failure',
  
  LOGOUT = '[User] Logout',
  LOGOUT_SUCCESS = '[User] Logout Success',
  LOGOUT_FAILURE = '[User] Logout Failure',
  
  REFRESH_TOKEN = '[User] Refresh Token',
  REFRESH_TOKEN_SUCCESS = '[User] Refresh Token Success',
  REFRESH_TOKEN_FAILURE = '[User] Refresh Token Failure'
}

// Version temporaire des actions pour permettre la compilation
export const loadUser = (username: string) => ({ type: UserActionTypes.LOAD_USER, payload: { username } });
export const loadUserSuccess = (user: any) => ({ type: UserActionTypes.LOAD_USER_SUCCESS, payload: { user } });
export const loadUserFailure = (error: any) => ({ type: UserActionTypes.LOAD_USER_FAILURE, payload: { error } });

export const login = (email: string, password: string, rememberMe: boolean) => 
  ({ type: UserActionTypes.LOGIN, payload: { email, password, rememberMe } });
export const loginSuccess = (user: any, token: string) => 
  ({ type: UserActionTypes.LOGIN_SUCCESS, payload: { user, token } });
export const loginFailure = (error: any) => 
  ({ type: UserActionTypes.LOGIN_FAILURE, payload: { error } });

export const logout = () => ({ type: UserActionTypes.LOGOUT });
export const logoutSuccess = () => ({ type: UserActionTypes.LOGOUT_SUCCESS });
export const logoutFailure = (error: any) => 
  ({ type: UserActionTypes.LOGOUT_FAILURE, payload: { error } });

export const refreshToken = () => ({ type: UserActionTypes.REFRESH_TOKEN });
export const refreshTokenSuccess = (token: string) => 
  ({ type: UserActionTypes.REFRESH_TOKEN_SUCCESS, payload: { token } });
export const refreshTokenFailure = (error: any) => 
  ({ type: UserActionTypes.REFRESH_TOKEN_FAILURE, payload: { error } });

// Actions NgRx commentées
/*
export const loadUser = createAction(
  UserActionTypes.LOAD_USER,
  props<{ username: string }>()
);

export const loadUserSuccess = createAction(
  UserActionTypes.LOAD_USER_SUCCESS,
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  UserActionTypes.LOAD_USER_FAILURE,
  props<{ error: any }>()
);

export const login = createAction(
  UserActionTypes.LOGIN,
  props<{ email: string; password: string; rememberMe: boolean }>()
);

export const loginSuccess = createAction(
  UserActionTypes.LOGIN_SUCCESS,
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  UserActionTypes.LOGIN_FAILURE,
  props<{ error: any }>()
);

export const logout = createAction(
  UserActionTypes.LOGOUT
);

export const logoutSuccess = createAction(
  UserActionTypes.LOGOUT_SUCCESS
);

export const logoutFailure = createAction(
  UserActionTypes.LOGOUT_FAILURE,
  props<{ error: any }>()
);

export const refreshToken = createAction(
  UserActionTypes.REFRESH_TOKEN
);

export const refreshTokenSuccess = createAction(
  UserActionTypes.REFRESH_TOKEN_SUCCESS,
  props<{ token: string }>()
);

export const refreshTokenFailure = createAction(
  UserActionTypes.REFRESH_TOKEN_FAILURE,
  props<{ error: any }>()
);
*/
