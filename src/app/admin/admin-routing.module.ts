// src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/add',
    component: UserAddComponent
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent
  },
  {
    path: 'courses',
    component: CourseListComponent
  },
  {
    path: 'courses/add',
    component: CourseFormComponent
  },
  {
    path: 'courses/edit/:id',
    component: CourseFormComponent
  },
  {
    path: 'courses/details/:id',
    component: CourseDetailsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }