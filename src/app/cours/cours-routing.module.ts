// src/app/cours/cours-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectDetailComponent } from './components/subject-detail/subject-detail.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseViewerComponent } from './components/course-viewer/course-viewer.component';
import { CourseDetailResolver } from './resolvers/course-detail.resolver';

// Définition des routes de cours
const routes: Routes = [
  {
    path: '',
    component: CourseListComponent
  },
  {
    path: 'subject',
    children: [
      {
        path: '',
        component: SubjectListComponent
      },
      {
        path: ':id',
        component: SubjectDetailComponent
      }
    ]
  },
  // La route pour le détail d'un cours DOIT être placée AVANT les routes paramétrées génériques
  {
    path: 'view/:id',
    component: CourseDetailComponent,
    // Ne pas utiliser de resolver pour l'instant pour simplifier la navigation
    data: { skipAuthCheck: true } // Indique de ne pas vérifier l'authentification à ce niveau
  },
  // Nouvelle route avec un nom distinct pour éviter les conflits
  {
    path: 'viewer/:id',
    component: CourseViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CourseDetailResolver]
})
export class CoursRoutingModule { }