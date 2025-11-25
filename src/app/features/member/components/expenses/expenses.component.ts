import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoryItem {
  action: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  amount: number;
  file?: string;
}

interface Expense {
  date: string;
  category: string;
  amount: number | null;
  description: string;
  history: HistoryItem[];
}

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  // Form data
  expense: Expense = {
    date: '',
    category: '',
    amount: null,
    description: '',
    history: []
  };

  // File upload state
  selectedFile: File | null = null;
  uploadAreaLabel: string = 'Choose File  No file chosen';

  ngOnInit(): void {
    // Load mock history data
    this.expense.history = [
      {
        action: 'Infrastructure',
        description: 'Cloud hosting services',
        status: 'Pending',
        date: '3/20/2024',
        amount: 150.00,
        file: 'receipt-002.pdf'
      },
      {
        action: 'Marketing Campaign',
        description: 'Q1 advertising expenses',
        status: 'Approved',
        date: '3/15/2024',
        amount: 450.00,
        file: 'receipt-001.pdf'
      }
    ];
  }

  /**
   * Handle file selection
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadAreaLabel = `📄 ${this.selectedFile.name}`;
    } else {
      this.selectedFile = null;
      this.uploadAreaLabel = 'Choose File  No file chosen';
    }
  }

  /**
   * Submit expense form
   */
  submitExpense(): void {
    // Validation
    if (!this.expense.date || !this.expense.category || !this.expense.amount) {
      alert('Please fill out all required fields (Date, Category, Amount)');
      return;
    }

    if (this.expense.amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    console.log('Submitting Expense:', this.expense);
    console.log('Selected File:', this.selectedFile);

    // Create new history item
    const newHistoryItem: HistoryItem = {
      action: this.expense.category,
      description: this.expense.description || 'No description provided',
      status: 'Pending',
      date: new Date(this.expense.date).toLocaleDateString('en-US'),
      amount: this.expense.amount,
      file: this.selectedFile ? this.selectedFile.name : undefined
    };

    // Add to history
    this.expense.history.unshift(newHistoryItem);

    // Reset form
    this.expense.date = '';
    this.expense.category = '';
    this.expense.amount = null;
    this.expense.description = '';
    this.selectedFile = null;
    this.uploadAreaLabel = 'Choose File  No file chosen';

    // Success feedback
    alert('Expense submitted successfully! It is now pending approval.');
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
}