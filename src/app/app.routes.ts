import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { UserRole } from './core/enums/user-role.enum';

export const routes: Routes = [

  // --- 0. LANDING PAGE (Public Access) ---
  { 
    path: '', 
    loadComponent: () => import('./features/landing/components/home/home')
      .then(m => m.HomeComponent)
  },

  // --- 1. AUTHENTICATION ROUTES ---
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('../../../features/auth/components/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component')
          .then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // --- 2. ADMIN ROUTES (Protected) ---
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: [UserRole.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/admin/components/admin-dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      { 
        path: 'permissions', 
        loadComponent: () => import('./features/admin/components/permissions/permissions.component')
          .then(m => m.PermissionsComponent) 
      },
      { 
        path: 'roles', 
        loadComponent: () => import('./features/admin/components/roles/roles.component')
          .then(m => m.RolesComponent) 
      },
      { 
        path: 'users', 
        loadComponent: () => import('./features/admin/components/users/users')
          .then(m => m.UsersComponent) 
      }
    ]
  },
  
  // --- 3. PROJECT MANAGER ROUTES (Protected) ---
  {
    path: 'pm',
    canActivate: [roleGuard],
    data: { roles: [UserRole.PROJECT_MANAGER, UserRole.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/project-manager/components/pm-dashboard/pm-dashboard.component')
          .then(m => m.PmDashboardComponent) 
      },
      { 
        path: 'project-management', 
        loadComponent: () => import('./features/project-manager/components/project-management/project-management.component')
          .then(m => m.ProjectManagementComponent) 
      },
      { 
        path: 'task-board', 
        loadComponent: () => import('./features/project-manager/components/task-board/task-board.component')
          .then(m => m.TaskBoardComponent) 
      },
      { 
        path: 'receipts', 
        loadComponent: () => import('./features/project-manager/components/receipts/receipts.component')
          .then(m => m.ReceiptsComponent) 
      },
      { 
        path: 'team-members', 
        loadComponent: () => import('./features/project-manager/components/team-member/team-member.component')
          .then(m => m.TeamMemberComponent) 
      }
    ]
  },

  // --- 4. MEMBER ROUTES (Protected) ---
  {
    path: 'member',
    canActivate: [roleGuard],
    data: { roles: [UserRole.MEMBER, UserRole.ADMIN] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/member/components/dashboard/dashboard.component')
          .then(m => m.DashboardComponent) 
      },
      { 
        path: 'expenses', 
        loadComponent: () => import('./features/member/components/expenses/expenses.component')
          .then(m => m.ExpensesComponent) 
      },
      { 
        path: 'project-management', 
        loadComponent: () => import('./features/member/components/project-management/project-management.component')
          .then(m => m.ProjectManagementComponent) 
      },
      { 
        path: 'task-board', 
        loadComponent: () => import('./features/member/components/task-board/task-board.component')
          .then(m => m.TaskBoardComponent) 
      },
      { 
        path: 'team-members', 
        loadComponent: () => import('./features/member/components/team-member/team-member.component')
          .then(m => m.TeamMemberComponent) 
      }
    ]
  },

  // --- 5. UNAUTHORIZED ROUTE ---
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },

  // --- 6. FALLBACK ROUTE (404) ---
  { path: '**', redirectTo: '' }
];