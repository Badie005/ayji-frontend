// src/app/cours/cours.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursRoutingModule } from './cours-routing.module';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectDetailComponent } from './components/subject-detail/subject-detail.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoursRoutingModule,
    // Importer les composants standalone
    SubjectListComponent,
    SubjectDetailComponent,
    CourseDetailComponent
  ]
})
export class CoursModule { }