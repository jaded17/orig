import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { PmDashboard } from './components/pm-dashboard/pm-dashboard';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { ReceiptApprovalComponent } from './components/receipts/receipts.component';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TeamMembersComponent } from './components/team-member/team-member.component';
import { ProjectManagerRoutingModule } from './project-manager-routing.module';

@NgModule({
  declarations: [
    PmDashboard,
    ProjectManagementComponent,
   ReceiptApprovalComponent,
    TaskBoardComponent,
    TeamMembersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectManagerRoutingModule,
    SharedModule
  ]
})
export class ProjectManagerModule { }