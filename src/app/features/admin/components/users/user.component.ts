import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  created_at: string;
  selected?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html' , 
  styleUrls: ['./user.component.css']
})
export class UsersComponent implements OnInit {
  entriesPerPage = 100;
  searchTerm = '';
  loading = false;
  error = '';
  submitting = false;
  
  // Modal visibility
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Forms
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  
  selectedUser: User | null = null;
  
  users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'administrator', status: 'active', created_at: '2024-01-15' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'moderator', status: 'active', created_at: '2024-02-20' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'inactive', created_at: '2024-03-10' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // Initialize Add User Form with validation
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      status: ['active', Validators.required]
    });

    // Initialize Edit User Form
    this.editUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Uncomment to load from API
    // this.loadUsers();
  }

  // ===== DATA LOADING =====
  loadUsers() {
    this.loading = true;
    this.error = '';

    // TODO: Uncomment when connecting to Laravel
    /*
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  filteredUsers() {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => 
      u.name.toLowerCase().includes(term) || 
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }

  toggleAll(event: any) {
    this.users.forEach(u => u.selected = event.target.checked);
  }

  allSelected() {
    return this.users.length > 0 && this.users.every(u => u.selected);
  }

  hasSelected() {
    return this.users.some(u => u.selected);
  }

  // ===== ADD USER MODAL =====
  openAddModal() {
    this.addUserForm.reset({ status: 'active' });
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addUser() {
    if (this.addUserForm.invalid) {
      // Mark all fields as touched to show errors
      Object.keys(this.addUserForm.controls).forEach(key => {
        this.addUserForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const userData = this.addUserForm.value;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.closeAddModal();
        alert('User created successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Failed to create user: ' + err.error.message);
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: this.users.length + 1,
        ...userData,
        created_at: new Date().toISOString().split('T')[0]
      };
      this.users.push(newUser);
      this.closeAddModal();
      alert('User created successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== VIEW USER MODAL =====
  openViewModal(user: User) {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedUser = null;
  }

  // ===== EDIT USER MODAL =====
  openEditModal(user: User) {
    this.selectedUser = user;
    this.editUserForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  updateUser() {
    if (this.editUserForm.invalid) {
      Object.keys(this.editUserForm.controls).forEach(key => {
        this.editUserForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const userData = this.editUserForm.value;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.userService.updateUser(this.selectedUser!.id, userData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeEditModal();
        alert('User updated successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData };
      }
      this.closeEditModal();
      alert('User updated successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== DELETE USER MODAL =====
  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  confirmDelete() {
    if (!this.selectedUser) return;

    this.submitting = true;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
        this.closeDeleteModal();
        alert('User deleted successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      this.users = this.users.filter(u => u.id !== this.selectedUser!.id);
      this.closeDeleteModal();
      alert('User deleted successfully!');
      this.submitting = false;
    }, 1000);
  }

  // ===== BULK DELETE =====
  bulkDelete() {
    const selectedIds = this.users.filter(u => u.selected).map(u => u.id);
    
    if (selectedIds.length === 0) {
      alert('Please select users to delete');
      return;
    }

    if (!confirm(`Delete ${selectedIds.length} user(s)?`)) {
      return;
    }

    this.submitting = true;

    // TODO: Uncomment when connecting to Laravel
    /*
    this.userService.bulkDeleteUsers(selectedIds).subscribe({
      next: () => {
        this.users = this.users.filter(u => !u.selected);
        alert('Users deleted successfully!');
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error deleting users:', err);
        alert('Failed to delete users');
        this.submitting = false;
      }
    });
    */

    // Simulate API call
    setTimeout(() => {
      this.users = this.users.filter(u => !u.selected);
      alert('Users deleted successfully!');
      this.submitting = false;
    }, 1000);
  }
}