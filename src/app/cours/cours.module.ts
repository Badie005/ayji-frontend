import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursRoutingModule } from './cours-routing.module';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CoursRoutingModule,
    CourseListComponent,
    CourseDetailComponent
  ]
})
export class CoursModule { }
