import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
// import { environment } from '../environments/environment';

interface Message {
  id?: number;
  sender: 'user' | 'manager';
  sender_name: string;
  message: string;
  category: string;
  timestamp: string;
  created_at?: string;
}

interface ProjectManager {
  name: string;
  status: 'online' | 'offline';
  availability: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit, OnDestroy {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  selectedCategory = 'general';
  isLoading = true;
  hasError = false;
  errorMessage = '';
  isSending = false;
  
  projectManager: ProjectManager = {
    name: 'Project Manager',
    status: 'online',
    availability: 'Available Mon-Fri, 9am-6pm'
  };

  categories = [
    { value: 'general', label: 'General' },
    { value: 'project-status', label: 'Project Status' },
    { value: 'deliverables', label: 'Deliverables' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'meetings', label: 'Meetings' },
    { value: 'issues', label: 'Issues/Concerns' }
  ];

  communicationGuidelines = [
    'Ask questions about project status',
    'Provide feedback on deliverables',
    'Request clarification on expenses',
    'Schedule review meetings',
    'Report issues or concerns'
  ];
  
  private destroy$ = new Subject<void>();
  // Uncomment this line when connecting to Laravel backend
  // private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Uncomment this block when connecting to Laravel backend
    // this.loadMessages();

    // Using mock data for now
    this.loadMockData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // LARAVEL BACKEND CONNECTION (COMMENTED)

  /*
  loadMessages() {
    this.isLoading = true;
    this.hasError = false;
    
    this.http.get<ApiResponse<Message[]>>(`${this.apiUrl}/feedback/messages`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.messages = response.data;
            this.isLoading = false;
            this.hasError = false;
            setTimeout(() => this.scrollToBottom(), 100);
          } else {
            this.handleError('Invalid response format');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isSending) return;

    this.isSending = true;
    const messageData = {
      message: this.newMessage.trim(),
      category: this.selectedCategory
    };

    this.http.post<ApiResponse<Message>>(`${this.apiUrl}/feedback/messages`, messageData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.messages.push(response.data);
            this.newMessage = '';
            this.isSending = false;
            setTimeout(() => this.scrollToBottom(), 100);
          } else {
            this.handleError('Failed to send message');
            this.isSending = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
          this.isSending = false;
        }
      });
  }
  */

  // MOCK DATA (CURRENTLY ACTIVE - COMMENT WHEN READY FOR BACKEND)

  loadMockData() {
    setTimeout(() => {
      // Mock project manager data
      this.projectManager = {
        name: 'Sarah Johnson',
        status: 'online',
        availability: 'Available Mon-Fri, 9am-6pm'
      };

      // Mock messages data
      this.messages = [
        {
          sender: 'manager',
          sender_name: 'Project Manager',
          message: "Hello! Welcome to the client portal. I'm here to help with any questions or concerns you may have about your projects.",
          category: 'general',
          timestamp: 'Nov 1, 9:00 AM'
        }
      ];
      
      this.isLoading = false;
      this.hasError = false;
      setTimeout(() => this.scrollToBottom(), 100);
    }, 800);
  }

  sendMessage() {
    if (!this.newMessage.trim() || this.isSending) return;

    this.isSending = true;

    // Mock sending message
    setTimeout(() => {
      const userMessage: Message = {
        sender: 'user',
        sender_name: 'You',
        message: this.newMessage.trim(),
        category: this.selectedCategory,
        timestamp: this.getCurrentTimestamp()
      };

      this.messages.push(userMessage);
      this.newMessage = '';
      this.isSending = false;
      setTimeout(() => this.scrollToBottom(), 100);

      // Mock manager response (optional)
      // setTimeout(() => {
      //   const managerResponse: Message = {
      //     sender: 'manager',
      //     sender_name: 'Project Manager',
      //     message: 'Thanks for your message! I\'ll get back to you shortly.',
      //     category: this.selectedCategory,
      //     timestamp: this.getCurrentTimestamp()
      //   };
      //   this.messages.push(managerResponse);
      //   setTimeout(() => this.scrollToBottom(), 100);
      // }, 1500);
    }, 500);
  }


  private handleError(error: HttpErrorResponse | string) {
    console.error('Error:', error);
    this.isLoading = false;
    this.hasError = true;
    
    if (typeof error === 'string') {
      this.errorMessage = error;
    } else if (error.status === 404) {
      this.errorMessage = 'Messages not found.';
    } else if (error.status === 401) {
      this.errorMessage = 'Unauthorized. Please log in again.';
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to view messages.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      this.errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      this.errorMessage = error.error?.message || 'Unable to load messages. Please try again.';
    }
  }

  retry() {
    this.errorMessage = '';
    this.loadMockData();
    // Uncomment when connecting to Laravel: this.loadMessages();
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : value;
  }
}