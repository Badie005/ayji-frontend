import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about.component';
import { AboutMainComponent } from './components/about-main/about-main.component';
import { MissionComponent } from './components/mission/mission.component';
import { TeamComponent } from './components/team/team.component';
import { ValuesComponent } from './components/values/values.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent,
    children: [
      {
        path: '',
        component: AboutMainComponent
      },
      {
        path: 'mission',
        component: MissionComponent
      },
      {
        path: 'team',
        component: TeamComponent
      },
      {
        path: 'values',
        component: ValuesComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }