import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing page
  {
    path: '',
    loadComponent: () => import('./features/landing/components/home/home').then(m => m.HomeComponent)
  },

  // Auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/components/users/user.component').then(m => m.UsersComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/admin/components/roles/roles.component').then(m => m.RolesComponent)
      },
      {
        path: 'permissions',
        loadComponent: () => import('./features/admin/components/permissions/permissions.component').then(m => m.PermissionsComponent)
      }
    ]
  },

  // Project Manager routes
  {
    path: 'pm',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/project-manager/components/pm-dashboard/pm-dashboard').then(m => m.PmDashboard)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/project-manager/components/project-management/project-management.component').then(m => m.ProjectManagementComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/project-manager/components/task-board/task-board.component').then(m => m.TaskBoardComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('./features/project-manager/components/team-member/team-member.component').then(m => m.TeamMembersComponent)
      },
      {
        path: 'receipts',
        loadComponent: () => import('./features/project-manager/components/receipts/receipts.component').then(m => m.ReceiptApprovalComponent)
      }
    ]
  },

 // Member routes
{
  path: 'member',
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./features/member/components/dashboard/dashboard.component').then(m => m.MemberDashboardComponent)
    },
    {
      path: 'projects',
      loadComponent: () => import('./features/member/components/project-management/project-management.component').then(m => m.ProjectManagementComponent)
    },
    {
      path: 'team',
      loadComponent: () => import('./features/member/components/team-member/team-member.component').then(m => m.TeamMembersComponent)
    },
    {
      path: 'expenses',
      loadComponent: () => import('./features/member/components/expenses/expenses.component').then(m => m.ExpensesComponent)
    },

  ]
},

  // Shared routes
  {
    path: 'shared/change-password',
    loadComponent: () => import('./shared/components/change-password/change-password.component').then(m => m.ChangePasswordComponent)
  },

  // Wildcard
  {
    path: '**',
    redirectTo: ''
  }
];