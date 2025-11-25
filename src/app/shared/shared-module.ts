import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { Header } from './components/header/header';
import { SidebarComponent } from './components/sidebar/sidebar';
import { Footer } from './components/footer/footer';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

@NgModule({
  declarations: [
    Header,
    SidebarComponent,
    Footer,
    HasRoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Header,
    SidebarComponent,
    Footer,
    HasRoleDirective
  ]
})
export class SharedModule { }