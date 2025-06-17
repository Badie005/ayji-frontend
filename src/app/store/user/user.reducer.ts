// Fichier temporairement adapté en attendant l'installation correcte de NgRx

// import { createReducer, on } from '@ngrx/store';
import { UserActionTypes } from './user.actions';
import { User } from '../../shared/models/user.model';

// Interface pour l'état utilisateur
export interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  loaded: boolean;
  error: any;
}

// État initial
export const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  loaded: false,
  error: null
};

// Version temporaire du réducteur pour permettre la compilation
export function userReducer(state: UserState = initialState, action: any): UserState {
  switch (action.type) {
    case UserActionTypes.LOAD_USER:
      return { ...state, loading: true };
    
    case UserActionTypes.LOAD_USER_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        loaded: true,
        user: action.payload.user,
        error: null
      };
    
    case UserActionTypes.LOAD_USER_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
      };
    
    case UserActionTypes.LOGIN:
      return { ...state, loading: true };
    
    case UserActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case UserActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    
    case UserActionTypes.LOGOUT:
      return { ...state, loading: true };
    
    case UserActionTypes.LOGOUT_SUCCESS:
      return initialState;
    
    case UserActionTypes.LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    
    default:
      return state;
  }
}

// Code NgRx commenté en attendant l'installation
/*
export const userReducer = createReducer(
  initialState,
  
  // Load User
  on(loadUser, state => ({ ...state, loading: true })),
  on(loadUserSuccess, (state, { user }) => ({ 
    ...state, 
    loading: false, 
    loaded: true,
    user: user,
    error: null
  })),
  on(loadUserFailure, (state, { error }) => ({ 
    ...state, 
    loading: false, 
    error 
  })),
  
  // Login
  on(login, state => ({ ...state, loading: true })),
  on(loginSuccess, (state, { user, token }) => ({
    ...state,
    loading: false,
    loaded: true,
    user,
    token,
    error: null
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Logout
  on(logout, state => ({ ...state, loading: true })),
  on(logoutSuccess, state => initialState),
  on(logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
*/
