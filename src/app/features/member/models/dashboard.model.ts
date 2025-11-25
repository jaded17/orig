export interface DashboardStats {
  totalProjects: number;
  myTasks: number;
  inProgress: number;
  completed: number;
}

export interface Deadline {
  id: number;
  project: string;
  task: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ProjectProgress {
  id: number;
  name: string;
  progress: number;
  dueDate: string;
  teamMembers: number;
}
