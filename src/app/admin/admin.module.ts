import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserManagementService } from './services/user-management.service';

@NgModule({
  declarations: [
    // Les composants standalone ne doivent pas être déclarés
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    // Importer les composants standalone au lieu de les déclarer
    AdminDashboardComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent
  ],
  providers: [UserManagementService]
})
export class AdminModule { }
