import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';


// Import all components (Keep)
import { MemberDashboardComponent } from './components/dashboard/dashboard.component';
// ... other components

@NgModule({
  declarations: [
    // ... all components
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // MemberRoutingModule REMOVED - Routing is now handled by the main app.routes.ts file
    SharedModule
  ]
})
export class MemberModule { }