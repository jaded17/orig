import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { MemberDashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TeamMembersComponent } from './components/team-member/team-member.component';

// Components






const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: MemberDashboardComponent,
    data: { title: 'My Dashboard' }
  },
  {
    path: 'tasks',
    component: TaskBoardComponent,
    data: { title: 'My Tasks' }
  },
  {
    path: 'projects',
    component: ProjectManagementComponent,
    data: { title: 'My Projects' }
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    data: { title: 'Expenses' }
  },
  {
    path: 'team',
    component: TeamMembersComponent,
    data: { title: 'Team Members' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }