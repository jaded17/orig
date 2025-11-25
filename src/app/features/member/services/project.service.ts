// ===================================
// src/app/services/project.service.ts
// ===================================
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Project } from '../models/project.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public projects$ = this.projectsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getAllProjects(): Observable<Project[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<Project[]>>('projects')
      .pipe(
        map(response => response.data),
        tap(projects => {
          this.projectsSubject.next(projects);
          this.loadingSubject.next(false);
        })
      );
  }

  getProject(id: number): Observable<Project> {
    return this.apiService.get<ApiResponse<Project>>(`projects/${id}`)
      .pipe(map(response => response.data));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.apiService.post<ApiResponse<Project>>('projects', project)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllProjects().subscribe())
      );
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.apiService.put<ApiResponse<Project>>(`projects/${id}`, project)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllProjects().subscribe())
      );
  }

  deleteProject(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`projects/${id}`)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllProjects().subscribe())
      );
  }

  updateProjectStatus(id: number, status: string): Observable<Project> {
    return this.apiService.patch<ApiResponse<Project>>(`projects/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  updateProjectProgress(id: number, progress: number): Observable<Project> {
    return this.apiService.patch<ApiResponse<Project>>(`projects/${id}/progress`, { progress })
      .pipe(map(response => response.data));
  }
}