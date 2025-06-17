import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupérer l'utilisateur depuis le localStorage ou sessionStorage
  let currentUser = null;
  const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  
  if (userStr) {
    try {
      currentUser = JSON.parse(userStr);
    } catch (e) {
      console.error('Erreur lors du parsing de l\'utilisateur:', e);
    }
  }
  
  // Si un utilisateur existe et a un token, l'ajouter à l'en-tête d'autorisation
  if (currentUser && currentUser.token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`
      }
    });
    
    // Continuer avec la requête modifiée
    return next(authReq);
  }
  
  // Sinon, continuer avec la requête originale
  return next(req);
};
