import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DashboardStats, Deadline, ProjectProgress } from '../models/dashboard.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // State management with BehaviorSubjects
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  private deadlinesSubject = new BehaviorSubject<Deadline[]>([]);
  private projectsSubject = new BehaviorSubject<ProjectProgress[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public stats$ = this.statsSubject.asObservable();
  public deadlines$ = this.deadlinesSubject.asObservable();
  public projects$ = this.projectsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * Get dashboard statistics
   */
  getStats(): Observable<DashboardStats> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<DashboardStats>>('dashboard/stats')
      .pipe(
        map(response => response.data),
        tap(stats => {
          this.statsSubject.next(stats);
          this.loadingSubject.next(false);
        })
      );
  }

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines(): Observable<Deadline[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<Deadline[]>>('dashboard/deadlines')
      .pipe(
        map(response => response.data),
        tap(deadlines => {
          this.deadlinesSubject.next(deadlines);
          this.loadingSubject.next(false);
        })
      );
  }

  /**
   * Get project progress
   */
  getProjectProgress(): Observable<ProjectProgress[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<ProjectProgress[]>>('dashboard/projects')
      .pipe(
        map(response => response.data),
        tap(projects => {
          this.projectsSubject.next(projects);
          this.loadingSubject.next(false);
        })
      );
  }

  /**
   * Load all dashboard data
   */
  loadDashboardData(): Observable<any> {
    this.loadingSubject.next(true);
    return new Observable(observer => {
      Promise.all([
        this.getStats().toPromise(),
        this.getUpcomingDeadlines().toPromise(),
        this.getProjectProgress().toPromise()
      ])
      .then(results => {
        this.loadingSubject.next(false);
        observer.next(results);
        observer.complete();
      })
      .catch(error => {
        this.loadingSubject.next(false);
        observer.error(error);
      });
    });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData().subscribe({
      next: () => console.log('Dashboard refreshed'),
      error: (err) => console.error('Error refreshing dashboard:', err)
    });
  }

  /**
   * Clear dashboard cache
   */
  clearCache(): void {
    this.statsSubject.next(null);
    this.deadlinesSubject.next([]);
    this.projectsSubject.next([]);
  }
}
