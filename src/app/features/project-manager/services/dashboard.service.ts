import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DashboardStats, Deadline, ProjectProgress } from '../models/dashboard.model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/pm/dashboard`;

  // State management
  private statsSubject = new BehaviorSubject<DashboardStats | null>(null);
  private deadlinesSubject = new BehaviorSubject<Deadline[]>([]);
  private projectsSubject = new BehaviorSubject<ProjectProgress[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public stats$ = this.statsSubject.asObservable();
  public deadlines$ = this.deadlinesSubject.asObservable();
  public projects$ = this.projectsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load all dashboard data from Laravel backend
   */
  loadDashboardData(): Observable<any> {
    this.loadingSubject.next(true);

    return forkJoin({
      stats: this.fetchStats(),
      deadlines: this.fetchDeadlines(),
      projects: this.fetchProjects()
    }).pipe(
      tap(data => {
        this.statsSubject.next(data.stats);
        this.deadlinesSubject.next(data.deadlines);
        this.projectsSubject.next(data.projects);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Fetch dashboard statistics
   */
  private fetchStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.API_URL}/stats`).pipe(
      map(response => ({
        totalProjects: response.data.total_projects || 0,
        myTasks: response.data.my_tasks || 0,
        inProgress: response.data.in_progress || 0,
        completed: response.data.completed || 0
      })),
      catchError(() => of({
        totalProjects: 0,
        myTasks: 0,
        inProgress: 0,
        completed: 0
      }))
    );
  }

  /**
   * Fetch upcoming deadlines
   */
  private fetchDeadlines(): Observable<Deadline[]> {
    return this.http.get<any>(`${this.API_URL}/deadlines`).pipe(
      map(response => 
        (response.data || []).map((item: any) => ({
          id: item.id,
          taskName: item.task_name,
          projectName: item.project_name,
          priority: item.priority,
          dueDate: item.due_date
        }))
      ),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch project progress
   */
  private fetchProjects(): Observable<ProjectProgress[]> {
    return this.http.get<any>(`${this.API_URL}/projects`).pipe(
      map(response => 
        (response.data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          progress: item.progress || 0,
          teamMembers: item.team_members_count || 0,
          dueDate: item.due_date
        }))
      ),
      catchError(() => of([]))
    );
  }

  /**
   * Refresh specific data
   */
  refreshStats(): Observable<DashboardStats> {
    return this.fetchStats().pipe(
      tap(stats => this.statsSubject.next(stats))
    );
  }

  refreshDeadlines(): Observable<Deadline[]> {
    return this.fetchDeadlines().pipe(
      tap(deadlines => this.deadlinesSubject.next(deadlines))
    );
  }

  refreshProjects(): Observable<ProjectProgress[]> {
    return this.fetchProjects().pipe(
      tap(projects => this.projectsSubject.next(projects))
    );
  }
}