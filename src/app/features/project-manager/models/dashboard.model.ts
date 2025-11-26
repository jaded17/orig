/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  totalProjects: number;
  myTasks: number;
  inProgress: number;
  completed: number;
}

/**
 * Deadline interface
 */
export interface Deadline {
  id: number;
  taskName: string;
  projectName: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string; // ISO date string
}

/**
 * Project progress interface
 */
export interface ProjectProgress {
  id: number;
  name: string;
  progress: number; // 0-100
  teamMembers: number;
  dueDate: string; // ISO date string
}