import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardStats, Deadline, ProjectProgress } from '../../models/dashboard.model';

import { CommonModule } from '@angular/common';
import { UserRole } from '../../../../core/enums/user-role.enum';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pm-dashboard.html',
  styleUrls: ['./pm-dashboard.css']
})
export class PmDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // User data
  currentUser: any = null;
  
  // Data properties
  stats: DashboardStats = {
    totalProjects: 0,
    myTasks: 0,
    inProgress: 0,
    completed: 0
  };
  upcomingDeadlines: Deadline[] = [];
  projectProgress: ProjectProgress[] = [];
  
  // UI state
  isLoading = false;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDashboardData();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current user from auth service
   */
  private loadCurrentUser(): void {
    // Get user from AuthService BehaviorSubject
    this.currentUser = this.authService.currentUserValue;
    
    // Also subscribe to updates
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
        next: () => {
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
   * Subscribe to service observables
   */
  private subscribeToUpdates(): void {
    // Subscribe to stats
    this.dashboardService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        if (stats) {
          this.stats = stats;
        }
      });

    // Subscribe to deadlines
    this.dashboardService.deadlines$
      .pipe(takeUntil(this.destroy$))
      .subscribe(deadlines => {
        this.upcomingDeadlines = deadlines;
      });

    // Subscribe to projects
    this.dashboardService.projects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.projectProgress = projects;
      });

    // Subscribe to loading state
    this.dashboardService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  /**
   * Get priority badge class
   */
  getPriorityClass(priority: string): string {
    return `badge-${priority.toLowerCase()}`;
  }

  /**
   * Format date for display
   */
  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    if (!this.currentUser) return 'User';
    return this.currentUser.name || this.currentUser.email || 'User';
  }

  /**
   * Get user role display
   */
  getUserRole(): string {
    if (!this.currentUser) return 'Project Manager';
    
    // Map UserRole enum to display string
    switch(this.currentUser.role) {
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.PROJECT_MANAGER:
        return 'Project Manager';
      case UserRole.MEMBER:
        return 'Team Member';
      default:
        return 'Project Manager';
    }
  }
}