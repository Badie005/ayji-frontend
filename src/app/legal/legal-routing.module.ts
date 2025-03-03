import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './legal.component';
import { MentionsLegalesComponent } from './components/mentions-legales/mentions-legales.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CguComponent } from './components/cgu/cgu.component';

const routes: Routes = [
  {
    path: '',
    component: LegalComponent,
    children: [
      {
        path: 'mentions-legales',
        component: MentionsLegalesComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'cgu',
        component: CguComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalRoutingModule { }