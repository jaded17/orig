import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { MemberDashboardComponent } from './components/dashboard/dashboard.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ProjectManagementComponent } from './components/project-management/project-management.component';
import { TaskBoardComponent } from './components/task-board/task-board.component';
import { TeamMembersComponent } from './components/team-member/team-member.component';
import { MemberRoutingModule } from './member-routing.module';

// Components





@NgModule({
  // 
  declarations: [
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MemberRoutingModule,
    SharedModule,
    
    // 2. Add all the standalone components to imports (Correct usage):
    MemberDashboardComponent,
    ExpensesComponent,
    ProjectManagementComponent,
    TaskBoardComponent,
    TeamMembersComponent
  ]
})
export class MemberModule { }