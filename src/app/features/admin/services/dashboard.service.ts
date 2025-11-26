import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

interface RecentActivity {
  id: number;
  initial: string;
  text: string;
  time: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  /**
   * Load all dashboard data from Laravel backend
   */
  loadDashboardData(): Observable<DashboardData> {
    return this.http.get<any>(`${this.API_URL}`).pipe(
      map(response => ({
        stats: {
          totalUsers: response.data.stats.total_users || 0,
          userGrowth: response.data.stats.user_growth || '',
          activeRoles: response.data.stats.active_roles || 0,
          newRoles: response.data.stats.new_roles || '',
          permissions: response.data.stats.permissions || 0,
          permissionsStatus: response.data.stats.permissions_status || '',
          activeSessions: response.data.stats.active_sessions || 0,
          lastUpdate: response.data.stats.last_update || ''
        },
        recentActivity: (response.data.recent_activity || []).map((item: any) => ({
          id: item.id,
          initial: item.user_initial || item.initial,
          text: item.description || item.text,
          time: item.time_ago || item.time
        }))
      })),
      catchError(() => of({
        stats: {
          totalUsers: 0,
          userGrowth: '',
          activeRoles: 0,
          newRoles: '',
          permissions: 0,
          permissionsStatus: '',
          activeSessions: 0,
          lastUpdate: ''
        },
        recentActivity: []
      }))
    );
  }

  /**
   * Get dashboard statistics only
   */
  getStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.API_URL}/stats`).pipe(
      map(response => ({
        totalUsers: response.data.total_users || 0,
        userGrowth: response.data.user_growth || '',
        activeRoles: response.data.active_roles || 0,
        newRoles: response.data.new_roles || '',
        permissions: response.data.permissions || 0,
        permissionsStatus: response.data.permissions_status || '',
        activeSessions: response.data.active_sessions || 0,
        lastUpdate: response.data.last_update || ''
      })),
      catchError(() => of({
        totalUsers: 0,
        userGrowth: '',
        activeRoles: 0,
        newRoles: '',
        permissions: 0,
        permissionsStatus: '',
        activeSessions: 0,
        lastUpdate: ''
      }))
    );
  }

  /**
   * Get recent activity only
   */
  getRecentActivity(): Observable<RecentActivity[]> {
    return this.http.get<any>(`${this.API_URL}/activity`).pipe(
      map(response => 
        (response.data || []).map((item: any) => ({
          id: item.id,
          initial: item.user_initial || item.initial,
          text: item.description || item.text,
          time: item.time_ago || item.time
        }))
      ),
      catchError(() => of([]))
    );
  }
}

//