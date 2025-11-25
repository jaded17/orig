import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})


export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    userGrowth: '',
    activeRoles: 0,
    newRoles: '', 
    permissions: 0,
    permissionsStatus: '',
    activeSessions: 0,
    lastUpdate: ''
  };

  recentActivity: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // TODO: Replace with actual API call to Laravel
    // Example:
    // this.dashboardService.getStats().subscribe(data => {
    //   this.stats = data;
    // });
    
    // Temporary mock data (remove when connecting to Laravel)
    this.stats = {
      totalUsers: 1234,
      userGrowth: '+12% from last month',
      activeRoles: 8,
      newRoles: '2 new this week',
      permissions: 45,
      permissionsStatus: 'All configured',
      activeSessions: 328,
      lastUpdate: 'Updated 5 mins ago'
    };

    this.recentActivity = [
      { initial: 'J', text: 'John Doe created a new role', time: '2 minutes ago' },
      { initial: 'J', text: 'Jane Smith updated user permissions', time: '15 minutes ago' },
      { initial: 'M', text: 'Mike Johnson added 3 new users', time: '1 hour ago' },
      { initial: 'S', text: 'Sarah Wilson changed password', time: '2 hours ago' }
    ];
  }

  addUser() {
    // TODO: Navigate to add user page or open modal
    console.log('Add user clicked');
  }

  createRole() {
    // TODO: Navigate to create role page
    console.log('Create role clicked');
  }

  addPermission() {
    // TODO: Navigate to add permission page
    console.log('Add permission clicked');
  }

  viewLogs() {
    // TODO: Navigate to logs page
    console.log('View logs clicked');
  }
}