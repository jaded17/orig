export interface Project {
  id: string;
  client: string;
  name: string;
  progress: number;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  tags?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  assignees: string[];
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  status: 'Pending' | 'Approved';
  date: string;
}

