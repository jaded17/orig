import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/user.component';

// Components

@NgModule({
  
  declarations: [
    // This array should now be empty (unless you have non-standalone items here).
  ],
  
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    
    // 2. ADD all standalone components to imports (Correct usage):
    AdminDashboardComponent,
    PermissionsComponent,
    RolesComponent,
    UsersComponent
  ]
})
export class AdminModule { }