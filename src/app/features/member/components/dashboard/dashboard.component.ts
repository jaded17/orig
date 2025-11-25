import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, Deadline, ProjectProgress } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class MemberDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all dashboard data
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
          this.error = err.message;
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
   * Handle view archive action
   */
  viewArchive(): void {
    console.log('View Archive clicked');
    // Navigate to archive page or open modal
  }

  /**
   * Handle website action
   */
  goToWebsite(): void {
    console.log('Website clicked');
    // Navigate to website or open external link
    window.open('https://your-website.com', '_blank');
  }

  /**
   * Get priority badge class
   */
  getPriorityClass(priority: string): string {
    return `badge-${priority.toLowerCase()}`;
  }
}