import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Permission {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  selected?: boolean;
}

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions.component.html', 
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  entriesPerPage = 100;
  searchTerm = '';
  
  // Modal visibility flags
  showAddModal = false;
  showViewModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Data for modals
  newPermission = { title: '', description: '' };
  editPermission: any = {};
  selectedPermission: Permission | null = null;
  
  permissions: Permission[] = [
    { id: 1, title: 'users_manage', description: 'Manage users and their accounts', createdAt: '2024-01-10' },
    { id: 2, title: 'roles_manage', description: 'Create and edit roles', createdAt: '2024-01-10' },
    { id: 3, title: 'permissions_manage', description: 'Manage system permissions', createdAt: '2024-01-10' },
    { id: 4, title: 'users_view', description: 'View user information', createdAt: '2024-01-10' },
    { id: 5, title: 'content_manage', description: 'Create, edit and delete content', createdAt: '2024-01-12' }
  ];

  ngOnInit() {}

  filteredPermissions() {
    if (!this.searchTerm) return this.permissions;
    const term = this.searchTerm.toLowerCase();
    return this.permissions.filter(p => 
      p.title.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
  }

  toggleAll(event: any) {
    this.permissions.forEach(p => p.selected = event.target.checked);
  }

  allSelected() {
    return this.permissions.length > 0 && this.permissions.every(p => p.selected);
  }

  hasSelected() {
    return this.permissions.some(p => p.selected);
  }

  // ===== ADD MODAL FUNCTIONS =====
  openAddModal() {
    this.newPermission = { title: '', description: '' };
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addPermission() {
    // Validate input
    if (!this.newPermission.title || !this.newPermission.description) {
      alert('Please fill in all fields');
      return;
    }

    // Create new permission
    const newPerm: Permission = {
      id: this.permissions.length + 1,
      title: this.newPermission.title,
      description: this.newPermission.description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add to list
    this.permissions.push(newPerm);    //To connect to laravel backend


    // Close modal and reset form
    this.closeAddModal();
    alert('Permission added successfully!');

    // TODO: When connecting to Laravel, replace with:
    // this.permissionService.createPermission(newPerm).subscribe(...)
  }

  // ===== VIEW MODAL FUNCTIONS =====
  openViewModal(permission: Permission) {
    this.selectedPermission = permission;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
    this.selectedPermission = null;
  }

  // ===== EDIT MODAL FUNCTIONS =====
  openEditModal(permission: Permission) {
    this.selectedPermission = permission;
    // Create a copy so we don't modify original until save
    this.editPermission = { ...permission };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPermission = null;
  }

  updatePermission() {
    // Validate input
    if (!this.editPermission.title || !this.editPermission.description) {
      alert('Please fill in all fields');
      return;
    }

    // Find and update the permission
    const index = this.permissions.findIndex(p => p.id === this.editPermission.id);
    if (index !== -1) {
      this.permissions[index] = { ...this.editPermission };
    }

    this.closeEditModal();
    alert('Permission updated successfully!');

    // TODO: When connecting to Laravel, replace with:
    // this.permissionService.updatePermission(id, data).subscribe(...)
  }

  // ===== DELETE MODAL FUNCTIONS =====
  openDeleteModal(permission: Permission) {
    this.selectedPermission = permission;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedPermission = null;
  }

  confirmDelete() {
    if (this.selectedPermission) {
      // Remove from array
      this.permissions = this.permissions.filter(p => p.id !== this.selectedPermission!.id);
      
      this.closeDeleteModal();
      alert('Permission deleted successfully!');

      // TODO: When connecting to Laravel, replace with:
      // this.permissionService.deletePermission(id).subscribe(...)
    }
  }

  // ===== BULK DELETE FUNCTION =====
  bulkDelete() {
    const selectedIds = this.permissions.filter(p => p.selected).map(p => p.id);
    
    if (selectedIds.length === 0) {
      alert('Please select permissions to delete');
      return;
    }

    if (confirm(`Delete ${selectedIds.length} permission(s)?`)) {
      // Remove all selected
      this.permissions = this.permissions.filter(p => !p.selected);
      alert('Permissions deleted successfully!');

      // TODO: When connecting to Laravel, replace with:
      // this.permissionService.bulkDelete(selectedIds).subscribe(...)
    }
  }
}