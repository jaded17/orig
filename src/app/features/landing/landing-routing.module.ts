import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }