import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { PmDashboard } from './components/pm-dashboard/pm-dashboard';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { ReceiptApprovalComponent } from './components/receipts/receipts.component';
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
    component: PmDashboard,
    data: { title: 'PM Dashboard' }
  },
  {
    path: 'projects',
    component: ProjectManagementComponent,
    data: { title: 'Project Management' }
  },
  {
    path: 'tasks',
    component: TaskBoardComponent,
    data: { title: 'Task Board' }
  },
  {
    path: 'team',
    component: TeamMembersComponent,
    data: { title: 'Team Members' }
  },
  {
    path: 'receipts',
    component: ReceiptApprovalComponent,
    data: { title: 'Receipts' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }