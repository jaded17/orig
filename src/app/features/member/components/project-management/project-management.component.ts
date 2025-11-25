// ===================================
// src/app/components/project-management/project-management.component.ts (UPDATED)
// ===================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';

interface TaskColumn {
  title: string;
  status: string;
  tasks: Task[];
  count: number;
}

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // View mode
  viewMode: 'kanban' | 'gantt' = 'kanban';

  // Projects for Gantt chart
  projects: Project[] = [];
  filteredProjects: Project[] = [];

  // Tasks for Kanban board
  taskColumns: TaskColumn[] = [
    { title: 'To Do', status: 'To Do', tasks: [], count: 0 },
    { title: 'In Progress', status: 'In Progress', tasks: [], count: 0 },
    { title: 'In Review', status: 'In Review', tasks: [], count: 0 },
    { title: 'Completed', status: 'Completed', tasks: [], count: 0 }
  ];

  // UI state
  isLoading = false;
  error: string | null = null;
  
  // Filter options
  selectedDueFilter = 'Due';
  selectedStatusFilter = 'All';
  statusOptions = ['All', 'To Do', 'In Progress', 'In Review', 'Completed'];

  // Kanban add task
  showAddTaskModal = false;
  newTask: Partial<Task> = {
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do'
  };

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load data based on view mode
   */
  loadData(): void {
    if (this.viewMode === 'kanban') {
      this.loadTasks();
    } else {
      this.loadProjects();
    }
  }

  /**
   * Load tasks for Kanban board
   */
  loadTasks(): void {
    this.isLoading = true;
    this.error = null;

    this.taskService.getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message;
          console.error('Error loading tasks:', err);
        }
      });
  }

  /**
   * Load projects for Gantt chart
   */
  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    this.projectService.getAllProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.message;
          console.error('Error loading projects:', err);
        }
      });
  }

  /**
   * Subscribe to updates
   */
  private subscribeToUpdates(): void {
    // Subscribe to tasks
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.organizeTasksIntoColumns(tasks);
      });

    // Subscribe to projects
    this.projectService.projects$
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.projects = projects;
        this.applyFilters();
      });
  }

  /**
   * Organize tasks into Kanban columns
   */
  private organizeTasksIntoColumns(tasks: Task[]): void {
    this.taskColumns.forEach(column => {
      column.tasks = tasks.filter(task => task.status === column.status);
      column.count = column.tasks.length;
    });
  }

  /**
   * Switch between Kanban and Gantt view
   */
  switchView(mode: 'kanban' | 'gantt'): void {
    this.viewMode = mode;
    this.loadData();
  }

  /**
   * Open add task modal
   */
  openAddTaskModal(): void {
    this.showAddTaskModal = true;
    this.newTask = {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'To Do'
    };
  }

  /**
   * Close add task modal
   */
  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  /**
   * Create new task
   */
  createTask(): void {
    if (!this.newTask.title) {
      alert('Please enter a task title');
      return;
    }

    this.taskService.createTask(this.newTask)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeAddTaskModal();
          console.log('Task created successfully');
        },
        error: (err) => {
          console.error('Error creating task:', err);
          alert('Failed to create task: ' + err.message);
        }
      });
  }

  /**
   * Update task status (drag and drop would use this)
   */
  updateTaskStatus(taskId: number, newStatus: string): void {
    this.taskService.updateTaskStatus(taskId, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Task status updated');
        },
        error: (err) => {
          console.error('Error updating task:', err);
        }
      });
  }

  /**
   * Delete task
   */
  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Task deleted');
          },
          error: (err) => {
            console.error('Error deleting task:', err);
          }
        });
    }
  }

  /**
   * Apply filters for Gantt chart
   */
  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      if (this.selectedStatusFilter !== 'All' && project.status !== this.selectedStatusFilter) {
        return false;
      }
      return true;
    });
  }

  /**
   * Filter handlers
   */
  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatusFilter = select.value;
    this.applyFilters();
  }

  onDueFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDueFilter = select.value;
  }

  /**
   * Get status class
   */
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'To Do': 'status-todo',
      'In Progress': 'status-progress',
      'In Review': 'status-review',
      'Completed': 'status-completed'
    };
    return statusMap[status] || 'status-todo';
  }

  /**
   * Get priority class
   */
  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return priorityMap[priority] || 'priority-medium';
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.loadData();
  }
}
