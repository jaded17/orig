import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Import all your copied components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
// ... import other components

@NgModule({
  declarations: [
    AdminDashboardComponent,
    // ... declare other components
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }