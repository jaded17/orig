import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service'; // You need this import for the role-checking methods
import { UserRole } from '../enums/user-role.enum'; // You need this import for the role-checking methods

// Interface for fetching/managing roles (from the second file)
interface Role {
  id: number;
  title: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;

  // Combine the constructors to inject both dependencies
  constructor(
    private authService: AuthService, // Dependency from the first file
    private http: HttpClient // Dependency from the second file
  ) {}

  // --- Role Checking Methods (from the first file) ---

  /** Checks if the current user has the ADMIN role. */
  isAdmin(): boolean {
    return this.authService.hasRole([UserRole.ADMIN]);
  }

  /** Checks if the current user has the PROJECT_MANAGER role. */
  isProjectManager(): boolean {
    return this.authService.hasRole([UserRole.PROJECT_MANAGER]);
  }

  /** Checks if the current user has the MEMBER role. */
  isMember(): boolean {
    return this.authService.hasRole([UserRole.MEMBER]);
  }

  /** Determines if the current user can access Admin features (Admin only). */
  canAccessAdminFeatures(): boolean {
    return this.isAdmin();
  }

  /** Determines if the current user can access Project Manager features (Admin or PM). */
  canAccessPMFeatures(): boolean {
    return this.isAdmin() || this.isProjectManager();
  }

  /** Determines if the current user can access Member features (Admin, PM, or Member). */
  canAccessMemberFeatures(): boolean {
    return this.isAdmin() || this.isProjectManager() || this.isMember();
  }

  // --- Role Management API Methods (from the second file) ---

  /** Fetches all roles from the API. */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  /** Fetches a single role by ID from the API. */
  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/roles/${id}`);
  }

  /** Creates a new role via the API. */
  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, role);
  }

  /** Updates an existing role via the API. */
  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/roles/${id}`, role);
  }

  /** Deletes a role by ID via the API. */
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }
}