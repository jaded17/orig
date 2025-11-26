// src/app/services/expense.service.ts

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Expense, ExpenseHistory, CreateExpenseDto } from '../models/expense.model';
import { ApiResponse } from '../models/api-response.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  private historySubject = new BehaviorSubject<ExpenseHistory[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public expenses$ = this.expensesSubject.asObservable();
  public history$ = this.historySubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getAllExpenses(): Observable<Expense[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<Expense[]>>('expenses')
      .pipe(
        map(response => response.data),
        tap(expenses => {
          this.expensesSubject.next(expenses);
          this.loadingSubject.next(false);
        })
      );
  }

  getExpense(id: number): Observable<Expense> {
    return this.apiService.get<ApiResponse<Expense>>(`expenses/${id}`)
      .pipe(map(response => response.data));
  }

  createExpense(expenseData: CreateExpenseDto): Observable<Expense> {
    const formData = new FormData();
    formData.append('title', expenseData.title);
    formData.append('category', expenseData.category);
    formData.append('amount', expenseData.amount.toString());
    formData.append('description', expenseData.description);
    
    if (expenseData.amountId) {
      formData.append('amount_id', expenseData.amountId);
    }
    
    if (expenseData.receipt) {
      formData.append('receipt', expenseData.receipt);
    }

    return this.apiService.post<ApiResponse<Expense>>('expenses', formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    })
      .pipe(
        map(response => response.data),
        tap(() => this.getAllExpenses().subscribe())
      );
  }

  updateExpense(id: number, expense: Partial<Expense>): Observable<Expense> {
    return this.apiService.put<ApiResponse<Expense>>(`expenses/${id}`, expense)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllExpenses().subscribe())
      );
  }

  deleteExpense(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`expenses/${id}`)
      .pipe(
        map(response => response.data),
        tap(() => this.getAllExpenses().subscribe())
      );
  }

  getExpenseHistory(): Observable<ExpenseHistory[]> {
    this.loadingSubject.next(true);
    return this.apiService.get<ApiResponse<ExpenseHistory[]>>('expenses/history')
      .pipe(
        map(response => response.data),
        tap(history => {
          this.historySubject.next(history);
          this.loadingSubject.next(false);
        })
      );
  }

  updateExpenseStatus(id: number, status: string): Observable<Expense> {
    return this.apiService.patch<ApiResponse<Expense>>(`expenses/${id}/status`, { status })
      .pipe(
        map(response => response.data),
        tap(() => this.getAllExpenses().subscribe())
      );
  }
}