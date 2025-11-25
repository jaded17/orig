import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


interface DashboardStats {
  totalUsers: number;
  userGrowth: string;
  activeRoles: number;
  newRoles: string;
  permissions: number;
  permissionsStatus: string;
  activeSessions: number;
  lastUpdate: string;
}

interface Activity {
  initial: string;
  text: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get dashboard statistics
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // Get recent activity log
  getRecentActivity(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/dashboard/activity`);
  }
}