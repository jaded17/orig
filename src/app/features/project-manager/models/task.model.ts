// src/app/models/task.model.ts

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  assignees?: string[];
  assignedTo?: number;
  projectId?: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  projectId?: number;
  assignedTo?: number;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: 'High' | 'Medium' | 'Low';
  status?: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  assignedTo?: number;
  dueDate?: string;
}