import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutMainComponent } from './components/about-main/about-main.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AboutRoutingModule,
    AboutMainComponent 
  ]
})
export class AboutModule { }
