import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class ApiService { // Renamed from 'Api' to 'ApiService' for consistency
  
  // Use the API URL from your unified environment configuration
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  // ==========================================================
  // 1. HTTP METHOD WRAPPERS (GET, POST, PUT, DELETE, PATCH)
  // ==========================================================

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.getOptions(options))
      .pipe(
        // Retry logic is useful for temporary network issues
        retry(1), 
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.getOptions(options))
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, this.getOptions(options))
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.getOptions(options))
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, this.getOptions(options))
      .pipe(
        catchError(this.handleError)
      );
  }

  // ==========================================================
  // 2. HEADER AND OPTION MANAGEMENT
  // ==========================================================

  /**
   * Get HTTP options with Authorization Bearer token from localStorage.
   */
  private getOptions(options?: any): { headers: HttpHeaders } {
    // NOTE: This assumes your AuthService is not handling the token directly.
    // If you used the AuthInterceptor setup, the token is handled there, 
    // and this logic can be simplified. But we'll keep it for now.
    
    // Using 'auth_token' as the key, consistent with your code
    const token = localStorage.getItem('auth_token'); 
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Logic to merge custom headers from the options object
    if (options?.headers) {
      const customHeaders = options.headers;
      if (customHeaders instanceof HttpHeaders) {
        customHeaders.keys().forEach(key => {
          const value = customHeaders.get(key);
          if (value) {
            headers = headers.set(key, value);
          }
        });
      }
    }

    return { headers };
  }

  // ==========================================================
  // 3. CENTRALIZED ERROR HANDLING
  // ==========================================================

  /**
   * Handle HTTP errors and provide user feedback.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      if (error.status === 0) {
        errorMessage = 'No connection to server. Please check your internet connection.';
      } else if (error.status === 401) {
        // Unauthorized: Clear token and redirect to login
        errorMessage = 'Unauthorized. Please login again.';
        localStorage.removeItem('auth_token');
        // NOTE: A better approach is to use the AuthInterceptor to handle 401 globally,
        // but for now, we'll keep the direct redirect.
        window.location.href = '/login'; 
      } else if (error.status === 403) {
        errorMessage = 'Forbidden. You do not have permission to access this resource.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 422) {
        // Validation errors (common in Laravel/API backends)
        errorMessage = error.error.message || 'Validation error occurred.';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else {
        errorMessage = error.error.message || `Server returned code ${error.status}`;
      }
    }

    console.error('API Error:', error);
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}