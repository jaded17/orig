import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserRole } from '../enums/user-role.enum'; // Assuming this enum exists
import { User } from '../models/user.model'; // Assuming this model exists

// --- Type Definitions (Refining the API response structure) ---

// Define the full structure of the user returned from the API
interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole; // Use the imported UserRole enum
}

// Define the structure of the successful login response
interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Use your Laravel API URL

  // Use AuthUser or null to strictly type the Subject
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser$: Observable<AuthUser | null>;

  constructor(private router: Router, private http: HttpClient) {
    // 1. Load user from localStorage on service initialization
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // --- Public Getters ---

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    // Check for both the presence of a user object AND a valid token
    return !!this.currentUserValue && !!this.getToken();
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- Core Authentication Methods ---

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Store token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);

          // Redirect based on the role received from the API
          this.redirectToRoleDashboard(response.user.role);
        }),
        catchError(error => {
          console.error('Login failed', error);
          // Re-throw the error for the component to handle
          return throwError(() => new Error('Login failed. Please check your credentials.')); 
        })
      );
  }

  logout(): void {
    // Call API for server-side logout (optional but recommended for invalidating tokens)
    this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        catchError(error => {
            // Log error but proceed with client-side logout anyway
            console.warn('Server logout failed, proceeding with client-side logout.', error);
            return throwError(() => error);
        })
      )
      .subscribe({
        complete: () => {
          // Clear client-side data and navigate
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.router.navigate(['/auth/login']);
        }
      });
  }

  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  // --- Role-Based Access Control (RBAC) Methods ---
  
  /**
   * Checks if the current user has any of the specified roles.
   * @param roles An array of UserRole enums to check against.
   */
  public hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    // Check if user exists and if their role is included in the required roles array
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Retrieves the current user's role.
   */
  public getUserRole(): UserRole | null {
    return this.currentUserValue?.role || null;
  }

  /**
   * Redirects the user to the appropriate dashboard based on their role.
   * @param role The UserRole to redirect for.
   */
  private redirectToRoleDashboard(role: UserRole): void {
    switch(role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case UserRole.PROJECT_MANAGER: // Using the full enum name
        this.router.navigate(['/pm/dashboard']);
        break;
      case UserRole.MEMBER:
        this.router.navigate(['/member/dashboard']);
        break;
      default:
        this.router.navigate(['/']); // Fallback route
    }
  }
}