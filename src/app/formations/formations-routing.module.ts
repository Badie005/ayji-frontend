import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SriFormationsComponent } from './pages/sri-formations/sri-formations.component';
import { BtsMcwComponent } from './pages/bts-mcw/bts-mcw.component';
import { ExercicesComponent } from './pages/exercices/exercices.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { RessourcesComponent } from './pages/ressources/ressources.component';

const routes: Routes = [
  { path: '', redirectTo: 'sri', pathMatch: 'full' },
  { path: 'sri', component: SriFormationsComponent },
  { path: 'bts-mcw', component: BtsMcwComponent },
  { path: 'exercices', component: ExercicesComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'ressources', component: RessourcesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationsRoutingModule { }
