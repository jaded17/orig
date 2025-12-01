import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
// import { environment } from '../environments/environment';

interface ProjectTask {
  id?: number;
  name: string;
  team: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  start_month: number;
  duration: number;
  created_at?: string;
  updated_at?: string;
}

interface Milestone {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  created_at?: string;
  updated_at?: string;
}

interface TaskUpdate {
  id?: number;
  task_name: string;
  update_text: string;
  updated_by: string;
  updated_at: string;
  status?: 'completed' | 'in-progress' | 'upcoming';
}

interface Project {
  id: number;
  title: string;
  description: string;
  overall_progress: number;
  start_date: string;
  end_date: string;
  tasks: ProjectTask[];
  milestones?: Milestone[];
  task_updates?: TaskUpdate[];
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project.component.html'
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  projectId: number = 1;
  projectTitle = '';
  projectDescription = '';
  overallProgress = 0;
  startDate = '';
  endDate = '';
  tasks: ProjectTask[] = [];
  milestones: Milestone[] = [];
  taskUpdates: TaskUpdate[] = [];
  months = ['Oct', 'Nov', 'Dec', 'Jan'];
  isLoading = true;
  hasError = false;
  errorMessage = '';
  activeTab: 'gantt' | 'milestones' | 'updates' = 'gantt';
  
  private destroy$ = new Subject<void>();
  // Uncomment this line when connecting to Laravel backend
  // private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Uncomment this block when connecting to Laravel backend
    // this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
    //   if (params['id']) {
    //     this.projectId = +params['id'];
    //   }
    //   this.loadProjectData();
    // });

    // Using mock data for now
    this.loadMockData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'gantt' | 'milestones' | 'updates') {
    this.activeTab = tab;
  }


  // LARAVEL BACKEND CONNECTION (COMMENTED)

  /*
  loadProjectData() {
    this.isLoading = true;
    this.hasError = false;
    
    this.http.get<ApiResponse<Project>>(`${this.apiUrl}/projects/${this.projectId}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const data = response.data;
            this.projectTitle = data.title;
            this.projectDescription = data.description;
            this.overallProgress = data.overall_progress;
            this.startDate = this.formatDate(data.start_date);
            this.endDate = this.formatDate(data.end_date);
            
            this.tasks = data.tasks.map(task => ({
              ...task,
              startMonth: task.start_month,
              status: task.status as 'completed' | 'in-progress' | 'upcoming'
            }));
            
            this.milestones = data.milestones || [];
            this.taskUpdates = data.task_updates || [];
            
            this.isLoading = false;
            this.hasError = false;
          } else {
            this.handleError('Invalid response format');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
  }
  */

  // MOCK DATA (CURRENTLY ACTIVE - COMMENT WHEN READY FOR BACKEND)

  loadMockData() {
    setTimeout(() => {
      // Mock project data
      this.projectTitle = 'Website Redesign';
      this.projectDescription = 'Complete redesign of corporate website with modern UI/UX';
      this.overallProgress = 75;
      this.startDate = 'Oct 1, 2025';
      this.endDate = 'Jan 15, 2026';
      
      // Mock tasks data
      this.tasks = [
        {
          name: 'Discovery & Research',
          team: 'Design Team',
          progress: 100,
          status: 'completed',
          start_month: 0,
          duration: 0.5
        },
        {
          name: 'UI/UX Design',
          team: 'Design Team',
          progress: 100,
          status: 'completed',
          start_month: 0.5,
          duration: 0.8
        },
        {
          name: 'Frontend Development',
          team: 'Dev Team',
          progress: 60,
          status: 'in-progress',
          start_month: 1.3,
          duration: 1
        },
        {
          name: 'Backend Integration',
          team: 'Dev Team',
          progress: 30,
          status: 'in-progress',
          start_month: 2.3,
          duration: 0.7
        },
        {
          name: 'Testing & QA',
          team: 'QA Team',
          progress: 0,
          status: 'upcoming',
          start_month: 3,
          duration: 0.5
        }
      ];

      // Mock milestones data
      this.milestones = [
        {
          title: 'Project Kickoff',
          description: 'Initial project meeting and requirements gathering',
          due_date: 'Oct 1, 2025',
          status: 'completed'
        },
        {
          title: 'Design Approval',
          description: 'Final design approved by stakeholders',
          due_date: 'Nov 5, 2025',
          status: 'completed'
        },
        {
          title: 'Development Complete',
          description: 'All development work ready for testing',
          due_date: 'Dec 15, 2025',
          status: 'in-progress'
        },
        {
          title: 'Final Delivery',
          description: 'Project handoff and go-live',
          due_date: 'Jan 15, 2026',
          status: 'upcoming'
        }
      ];

      // Mock task updates data
      this.taskUpdates = [
        {
          task_name: 'Discovery & Research',
          update_text: 'User research and competitive analysis completed',
          updated_by: 'Sarah Johnson',
          updated_at: 'Oct 15, 2025',
          status: 'completed'
        },
        {
          task_name: 'UI/UX Design',
          update_text: 'All wireframes and mockups approved by client',
          updated_by: 'Mike Chen',
          updated_at: 'Nov 8, 2025',
          status: 'completed'
        },
        {
          task_name: 'Frontend Development',
          update_text: 'Responsive layouts implemented, working on animations',
          updated_by: 'Alex Rodriguez',
          updated_at: 'Nov 28, 2025',
          status: 'in-progress'
        },
        {
          task_name: 'Backend Integration',
          update_text: 'API integration in progress, 30% complete',
          updated_by: 'David Kim',
          updated_at: 'Dec 1, 2025',
          status: 'in-progress'
        }
      ];
      
      this.isLoading = false;
      this.hasError = false;
    }, 800);
  }


  private handleError(error: HttpErrorResponse | string) {
    console.error('Error loading project data:', error);
    this.isLoading = false;
    this.hasError = true;
    
    if (typeof error === 'string') {
      this.errorMessage = error;
    } else if (error.status === 404) {
      this.errorMessage = 'Project not found.';
    } else if (error.status === 401) {
      this.errorMessage = 'Unauthorized. Please log in again.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to view this project.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      this.errorMessage = error.error?.message || 'Unable to load project data. Please try again.';
    }
  }

  retry() {
    this.errorMessage = '';
    this.loadMockData();
    // Uncomment when connecting to Laravel: this.loadProjectData();
  }

 
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success-500';
      case 'in-progress':
        return 'bg-brand-500';
      case 'upcoming':
        return 'bg-gray-300 dark:bg-gray-700';
      default:
        return 'bg-gray-300 dark:bg-gray-700';
    }
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400';
      case 'in-progress':
        return 'bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400';
      case 'upcoming':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;
      case 'in-progress':
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
      case 'upcoming':
        return `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`;
      default:
        return '';
    }
  }

  getTaskPosition(task: ProjectTask): { left: string; width: string } {
    const totalMonths = 4;
    const startMonth = task.start_month ?? 0;
    const leftPercent = (startMonth / totalMonths) * 100;
    const widthPercent = (task.duration / totalMonths) * 100;
    
    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`
    };
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  }
}