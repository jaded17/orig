import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent {
  columns = [
    {
      title: 'To Do',
      count: 2,
      tasks: [
        { id: 1, title: 'Product design', description: 'Design and prototype new..', priority: 'High', assignees: ['JD', 'MK'] },
        { id: 2, title: 'Update website cybersecurity', description: '', priority: 'Medium', assignees: ['AS'] }
      ]
    },
    {
      title: 'In Progress',
      count: 1,
      tasks: [
        { id: 3, title: 'Website development', description: '', priority: 'High', assignees: ['TG', 'NK'] }
      ]
    },
    {
      title: 'In Review',
      count: 1,
      tasks: [
        { id: 4, title: 'Refine and optimize', description: 'Refine and optimize the user...', priority: 'High', assignees: ['HD'] }
      ]
    },
    {
      title: 'Completed',
      count: 1,
      tasks: [
        { id: 5, title: 'Website Research', description: 'Conduct user research and analysis...', priority: 'High', assignees: ['PK', 'NK'] }
      ]
    }
  ];
}