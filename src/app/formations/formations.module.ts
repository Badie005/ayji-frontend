import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormationsRoutingModule } from './formations-routing.module';
import { SriFormationsComponent } from './pages/sri-formations/sri-formations.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormationsRoutingModule,
    SriFormationsComponent
  ]
})
export class FormationsModule { }
