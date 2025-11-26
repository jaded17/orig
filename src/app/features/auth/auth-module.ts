import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing-module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  // FIX: These components are standalone and MUST be removed from 'declarations'.
  declarations: [
    // Leave empty or add ONLY non-standalone entities
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
    
    // FIX: Standalone components are imported like modules.
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  ],
  // Export the standalone components if other modules need to use them
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }