// src/app/shared/shared-exports.ts (New utility file)

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { SidebarComponent } from './components/sidebar/sidebar';
import { HasRoleDirective } from './directives/has-role.directive';

export const SharedModule = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  
  // Standalone Components
  ChangePasswordComponent,
  Footer,
  Header,
  SidebarComponent,
  
  // Standalone Directives
  HasRoleDirective
];