import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../enums/user-role.enum';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as UserRole[];
  
  if (!authService.isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // User doesn't have permission, redirect to their dashboard
  const userRole = authService.getUserRole();
  switch(userRole) {
    case UserRole.ADMIN:
      router.navigate(['/admin/dashboard']);
      break;
    case UserRole.PROJECT_MANAGER:
      router.navigate(['/pm/dashboard']);
      break;
    case UserRole.MEMBER:
      router.navigate(['/member/dashboard']);
      break;
    default:
      router.navigate(['/']);
  }
  
  return false;
};