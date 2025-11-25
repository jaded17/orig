import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';



export interface HistoryItem {
  id?: string;
  action: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  amount: number;
  file?: string;
  submittedBy: string;
}

export interface ExpenseSubmitRequest {
  date: string;
  category: string;
  amount: number;
  description: string;
  receipt?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  /**
   * Get all expenses for the current user
   */
  getExpenses(): Observable<ApiResponse<HistoryItem[]>> {
    return this.http.get<ApiResponse<HistoryItem[]>>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Get a single expense by ID
   */
  getExpenseById(id: string): Observable<ApiResponse<HistoryItem>> {
    return this.http.get<ApiResponse<HistoryItem>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Submit a new expense
   */
  submitExpense(expenseData: ExpenseSubmitRequest): Observable<ApiResponse<HistoryItem>> {
    const formData = new FormData();
    formData.append('date', expenseData.date);
    formData.append('category', expenseData.category);
    formData.append('amount', expenseData.amount.toString());
    formData.append('description', expenseData.description || '');
    
    if (expenseData.receipt) {
      formData.append('receipt', expenseData.receipt, expenseData.receipt.name);
    }

    return this.http.post<ApiResponse<HistoryItem>>(this.apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing expense
   */
  updateExpense(id: string, expenseData: Partial<ExpenseSubmitRequest>): Observable<ApiResponse<HistoryItem>> {
    return this.http.put<ApiResponse<HistoryItem>>(`${this.apiUrl}/${id}`, expenseData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete an expense
   */
  deleteExpense(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Download receipt file
   */
  downloadReceipt(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/receipt`, {
      responseType: 'blob'
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get expense summary statistics
   */
  getExpenseSummary(): Observable<ApiResponse<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/summary`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || 
                     error.error?.error || 
                     `Server error: ${error.status} - ${error.message}`;
    }

    console.error('HTTP Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}