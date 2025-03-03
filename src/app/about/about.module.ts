import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { AboutMainComponent } from './components/about-main/about-main.component';
import { MissionComponent } from './components/mission/mission.component';
import { TeamComponent } from './components/team/team.component';
import { ValuesComponent } from './components/values/values.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    // Les composants non-standalone vont ici
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    // Importez les composants standalone ici
    AboutComponent,
    AboutMainComponent,
    MissionComponent,
    TeamComponent,
    ValuesComponent,
    ContactComponent
  ]
})
export class AboutModule { }