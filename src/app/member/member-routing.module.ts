import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// La route courses est redirigée vers /cours pour standardiser les URLs

const routes: Routes = [
  // Redirection de l'ancienne URL vers la nouvelle
  {
    path: 'courses',
    redirectTo: '/cours',
    pathMatch: 'full'
  }
  // Autres routes du membre peuvent être ajoutées ici en tant que frères
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
