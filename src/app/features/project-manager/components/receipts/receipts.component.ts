import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs'; // Changed 'of' to 'throwError' for API failure handling

// The interfaces model the data and API structure
interface HistoryItem {
  id?: number; 
  action: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  amount: number;
  file?: string;
  submittedBy: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string; 
}

// Interface for the PUT request body for clarity
interface StatusUpdatePayload {
    status: 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-receipt-approval', 
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptApprovalComponent implements OnInit { 
  // API Configuration - IMPORTANT: Update this to your live Laravel backend URL
  private readonly API_BASE_URL = 'http://localhost:8000/api'; 
  
  // Data State
  history: HistoryItem[] = []; 

  // Summary statistics
  totalExpenses: number = 0;
  approvedExpenses: number = 0;
  pendingExpenses: number = 0;

  // Loading states
  isLoading: boolean = false;
  isProcessing: boolean = false; 

  // Error handling
  errorMessage: string = '';

  // PM Role Data
  public loggedInUser = 'John Johnson';
  public loggedInRole = 'Project Manager';


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  /**
   * Load expenses/receipts from backend
   * This now relies purely on the API and throws an error on HTTP failure.
   */
  loadExpenses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.history = []; // Clear previous data

    this.http.get<ApiResponse<HistoryItem[]>>(`${this.API_BASE_URL}/receipts/pending`)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading receipts from API:', error);
          // Set a user-friendly error message based on the HTTP status
          this.errorMessage = `Failed to load receipts. Status: ${error.status} - Please check API connectivity.`;
           // Rethrow the error to stop the subscription chain
          return throwError(() => new Error(this.errorMessage));
        })
      )
      .subscribe(response => {
        // Process successful HTTP response based on the API's 'success' flag
        if (response.success && response.data) {
            this.history = response.data;
            this.calculateSummary();
        } else {
            // Handle cases where the HTTP call succeeds (e.g., 200 OK) but API logic returns failure
            this.errorMessage = response.error || 'API call succeeded but returned a data error.';
        }
      });
  }

  // Removed getMockData()

  /**
   * Calculate summary statistics
   */
  calculateSummary(): void {
    this.totalExpenses = this.history.reduce((sum, item) => sum + item.amount, 0);
    this.approvedExpenses = this.history
      .filter(item => item.status === 'Approved')
      .reduce((sum, item) => sum + item.amount, 0);
    this.pendingExpenses = this.history
      .filter(item => item.status === 'Pending')
      .reduce((sum, item) => sum + item.amount, 0);
  }

  /**
   * Update the status of a receipt (Approve or Reject)
   * This now relies purely on the API and handles failure by setting an error message.
   */
  updateReceiptStatus(item: HistoryItem, newStatus: 'Approved' | 'Rejected'): void {
    if (item.status !== 'Pending') {
      alert(`Expense is already ${item.status}. Cannot change.`);
      return;
    }

    if (!item.id) {
        alert('Cannot process: Receipt ID is missing.');
        return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    const payload: StatusUpdatePayload = { status: newStatus };

    // API call to update the receipt status
    this.http.put<ApiResponse<null>>(`${this.API_BASE_URL}/receipts/${item.id}/status`, payload)
      .pipe(
        finalize(() => this.isProcessing = false),
        catchError((httpError: HttpErrorResponse) => {
          console.error(`Error ${newStatus}ing receipt:`, httpError);
          // Set error message and re-throw the error
          this.errorMessage = `Failed to ${newStatus} receipt. Status: ${httpError.status}.`;
          alert(this.errorMessage);
          return throwError(() => new Error(this.errorMessage));
        })
      )
      .subscribe(response => {
        if (response.success) {
          // Update the status locally and recalculate summary on success
          const index = this.history.findIndex(i => i.id === item.id);
          if (index !== -1) {
            this.history[index].status = newStatus;
            this.calculateSummary(); 
            alert(response.message || `Receipt ${item.id} successfully set to ${newStatus}.`); 
          }
        } else {
          // Handle API success: false response
          this.errorMessage = response.error || `API logic failed to ${newStatus} receipt.`;
          alert(this.errorMessage);
        }
      });
  }
  
  /**
   * Download receipt file (Placeholder for real download logic)
   */
  downloadReceipt(item: HistoryItem): void {
    if (!item.file || !item.id) {
        alert('No receipt file found or ID missing.');
        return;
    }

    // In a real app, this would fetch the blob from the server.
    alert(`Simulating download of ${item.file} for expense ID: ${item.id}`);
  }

  /**
   * Get badge CSS class based on status
   */
  getBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Approved':
        return 'badge-approved';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return 'badge-pending';
    }
  }

  /**
   * Get initials from name
   */
  getInitials(name: string): string {
    // Handle cases where name might be combined or empty
    const parts = name.split(' ');
    if (parts.length === 1 && parts[0].includes('/')) {
        return parts[0].split('/')[0][0] + parts[0].split('/')[1][0];
    }
    return parts.map(n => n[0]).join('').toUpperCase();
  }

  /**
   * Get avatar color class
   */
  getAvatarClass(name: string): string {
    const colors = ['avatar-blue', 'avatar-green', 'avatar-yellow'];
    // Use a hash of the name to determine a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}