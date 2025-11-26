import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

interface DashboardStats {
  totalUsers: number;
  userGrowth: string;
  activeRoles: number;
  newRoles: string;
  permissions: number;
  permissionsStatus: string;
  activeSessions: number;
  lastUpdate: string;
}

interface RecentActivity {
  id: number;
  initial: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // User data
  currentUser: any = null;
  
  // Dashboard data
  stats: DashboardStats = {
    totalUsers: 0,
    userGrowth: '',
    activeRoles: 0,
    newRoles: '', 
    permissions: 0,
    permissionsStatus: '',
    activeSessions: 0,
    lastUpdate: ''
  };

  recentActivity: RecentActivity[] = [];

  // UI state
  isLoading = false;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user from auth service
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.currentUserValue;
    
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  /**
   * Load all dashboard data from backend
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.dashboardService.loadDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stats = data.stats;
          this.recentActivity = data.recentActivity;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message || 'Failed to load dashboard data';
          console.error('Error loading dashboard:', err);
        }
      });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  /**
   * Navigate to add user page
   */
  addUser(): void {
    this.router.navigate(['/admin/users']);
  }

  /**
   * Navigate to create role page
   */
  createRole(): void {
    this.router.navigate(['/admin/roles']);
  }

  /**
   * Navigate to add permission page
   */
  addPermission(): void {
    this.router.navigate(['/admin/permissions']);
  }

  /**
   * View system logs
   */
  viewLogs(): void {
    // TODO: Implement logs page when available
    console.log('View logs clicked');
    // this.router.navigate(['/admin/logs']);
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    if (!this.currentUser) return 'Admin';
    return this.currentUser.name || this.currentUser.email || 'Admin';
  }
}