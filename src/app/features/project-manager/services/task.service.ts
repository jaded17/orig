// ===================================
// src/app/services/task.service.ts
// ===================================
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public tasks$ = this.tasksSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getAllTasks(): Observable<Task[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<Task[]>>('tasks')
      .pipe(
        map(response => response.data),
        tap(tasks => {
          this.tasksSubject.next(tasks);
          this.loadingSubject.next(false);
        })
      );
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.apiService.get<ApiResponse<Task[]>>(`tasks?status=${status}`)
      .pipe(map(response => response.data));
  }

  getTask(id: number): Observable<Task> {
    return this.apiService.get<ApiResponse<Task>>(`tasks/${id}`)
      .pipe(map(response => response.data));
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.apiService.post<ApiResponse<Task>>('tasks', task)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllTasks().subscribe())
      );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.apiService.put<ApiResponse<Task>>(`tasks/${id}`, task)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllTasks().subscribe())
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`tasks/${id}`)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllTasks().subscribe())
      );
  }

  updateTaskStatus(id: number, status: string): Observable<Task> {
    return this.apiService.patch<ApiResponse<Task>>(`tasks/${id}/status`, { status })
      .pipe(
        map(response => response.data),
        tap(() => this.getAllTasks().subscribe())
      );
  }

  assignTask(id: number, assigneeId: number): Observable<Task> {
    return this.apiService.patch<ApiResponse<Task>>(`tasks/${id}/assign`, { assignee_id: assigneeId })
      .pipe(map(response => response.data));
  }
}
