import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/user.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    data: { title: 'Admin Dashboard' }
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'User Management' }
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: { title: 'Role Management' }
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    data: { title: 'Permission Management' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }