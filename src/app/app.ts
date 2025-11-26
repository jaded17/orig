import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { UserRole } from './core/enums/user-role.enum';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [
    CommonModule,
    RouterOutlet, 
    RouterLink,
    RouterLinkActive,
  ]
})
export class App implements OnInit, OnDestroy {
  isUserManagementOpen: boolean = false;
  showSidebar: boolean = false;
  userRole: UserRole | null = null;
  userName: string = '';
  
  UserRole = UserRole;
  
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      // Show sidebar for admin, pm, member, and shared routes
      this.showSidebar = event.url.startsWith('/admin') || 
                         event.url.startsWith('/pm') || 
                         event.url.startsWith('/member') ||
                         event.url.startsWith('/shared');
      
      // AUTO-DETECT ROLE FROM URL (for testing without login)
      if (event.url.startsWith('/admin')) {
        this.userRole = UserRole.ADMIN;
        this.userName = 'Admin User';
      } else if (event.url.startsWith('/pm')) {
        this.userRole = UserRole.PROJECT_MANAGER;
        this.userName = 'John Johnson';
      } else if (event.url.startsWith('/member')) {
        this.userRole = UserRole.MEMBER;
        this.userName = 'Sarah Williams';
      } else if (event.url.startsWith('/shared')) {
        // For shared routes, check if we have a stored role, otherwise default to member
        if (!this.userRole) {
          const storedRole = localStorage.getItem('currentRole');
          if (storedRole) {
            this.userRole = storedRole as UserRole;
            const storedName = localStorage.getItem('currentUserName');
            this.userName = storedName || 'User';
          } else {
            // Default to member if no role stored
            this.userRole = UserRole.MEMBER;
            this.userName = 'Sarah Williams';
          }
        }
        // Otherwise keep the current role
      } else {
        this.userRole = null;
        this.userName = '';
      }
      
      // Store current role when navigating to admin/pm/member
      if (this.userRole && event.url.match(/^\/(admin|pm|member)/)) {
        localStorage.setItem('currentRole', this.userRole);
        localStorage.setItem('currentUserName', this.userName);
      }
    });
  }

  ngOnInit(): void {
    // For testing: Set initial role based on current URL
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/admin')) {
      this.userRole = UserRole.ADMIN;
      this.userName = 'Admin User';
    } else if (currentUrl.startsWith('/pm')) {
      this.userRole = UserRole.PROJECT_MANAGER;
      this.userName = 'John Johnson';
    } else if (currentUrl.startsWith('/member')) {
      this.userRole = UserRole.MEMBER;
      this.userName = 'Sarah Williams';
    } else if (currentUrl.startsWith('/shared')) {
      // Try to get stored role
      const storedRole = localStorage.getItem('currentRole');
      if (storedRole) {
        this.userRole = storedRole as UserRole;
        const storedName = localStorage.getItem('currentUserName');
        this.userName = storedName || 'User';
      } else {
        // Default to member for testing
        this.userRole = UserRole.MEMBER;
        this.userName = 'Sarah Williams';
      }
    }
    
    // Store initial role
    if (this.userRole) {
      localStorage.setItem('currentRole', this.userRole);
      localStorage.setItem('currentUserName', this.userName);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserManagement(): void {
    this.isUserManagementOpen = !this.isUserManagementOpen;
  }

  logout(event: Event): void {
    event.preventDefault();
    // Clear stored role on logout
    localStorage.removeItem('currentRole');
    localStorage.removeItem('currentUserName');
    this.router.navigate(['/']);
  }
}