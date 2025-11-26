export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  amountId?: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseHistory {
  id: number;
  action: string;
  status: string;
  date: string;
  amount?: number;
}

export interface CreateExpenseDto {
  title: string;
  category: string;
  amount: number;
  amountId?: string;
  description: string;
  receipt?: File;
}
